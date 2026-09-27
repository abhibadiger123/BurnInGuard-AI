import asyncio
import random

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal

from app.models.component import Component
from app.models.burn_in_reading import BurnInReading

from app.services.anomaly_detector import detect_anomaly
from app.services.drift_predictor import predict_drift


router = APIRouter(
    tags=["Live Monitoring"]
)


@router.websocket("/ws/monitor/{component_id}")
async def monitor_component(
    websocket: WebSocket,
    component_id: int
):
    await websocket.accept()

    db: Session = SessionLocal()

    try:

        component = (
            db.query(Component)
            .filter(
                Component.id == component_id
            )
            .first()
        )

        if not component:

            await websocket.send_json({
                "type": "error",
                "message": "Component not found"
            })

            await websocket.close()

            return


        latest = (
            db.query(BurnInReading)
            .filter(
                BurnInReading.component_id ==
                component_id
            )
            .order_by(
                BurnInReading.timestamp.desc()
            )
            .first()
        )


        if latest:

            temperature = float(
                latest.temperature
                if latest.temperature is not None
                else 70.0
            )

            voltage = float(
                latest.voltage
                if latest.voltage is not None
                else 5.0
            )

            current = float(
                latest.current
                if latest.current is not None
                else 2.0
            )

            leakage = float(
                latest.leakage_current
                if latest.leakage_current is not None
                else 10.0
            )

            burn_in_hours = int(
                latest.burn_in_hours
                if latest.burn_in_hours is not None
                else 0
            )

        else:

            temperature = 70.0
            voltage = 5.0
            current = 2.0
            leakage = 10.0
            burn_in_hours = 0


        while True:

            temperature += random.uniform(
                -0.4,
                0.6
            )

            voltage += random.uniform(
                -0.02,
                0.02
            )

            current += random.uniform(
                -0.03,
                0.04
            )

            leakage += random.uniform(
                -0.15,
                0.25
            )


            temperature = max(
                temperature,
                0.0
            )

            voltage = max(
                voltage,
                0.0
            )

            current = max(
                current,
                0.0
            )

            leakage = max(
                leakage,
                0.0
            )


            power = (
                voltage * current
            )

            burn_in_hours += 1


            reading = BurnInReading(

                component_id=component_id,

                temperature=round(
                    temperature,
                    3
                ),

                voltage=round(
                    voltage,
                    3
                ),

                current=round(
                    current,
                    3
                ),

                power=round(
                    power,
                    3
                ),

                leakage_current=round(
                    leakage,
                    3
                ),

                value_0h=10.0,

                value_24h=10.8,

                value_168h=round(
                    leakage,
                    3
                ),

                burn_in_hours=burn_in_hours
            )


            db.add(reading)

            db.commit()

            db.refresh(reading)


            recent_readings = (
                db.query(BurnInReading)
                .filter(
                    BurnInReading.component_id ==
                    component_id
                )
                .order_by(
                    BurnInReading.timestamp.asc()
                )
                .all()
            )


            anomaly_result = detect_anomaly(
                recent_readings
            )


            drift_result = predict_drift(
                reading.value_0h,
                reading.value_24h
            )


            ai_result = {

                "anomaly_status":
                    anomaly_result.get(
                        "status"
                    ),

                "anomaly_score":
                    anomaly_result.get(
                        "anomaly_score"
                    ),

                "risk_level":
                    anomaly_result.get(
                        "risk_level"
                    ),

                "anomaly_explanation":
                    anomaly_result.get(
                        "explanation"
                    ),

                "drift_status":
                    drift_result.get(
                        "status"
                    ),

                "prediction":
                    drift_result.get(
                        "prediction"
                    ),

                "predicted_168h":
                    drift_result.get(
                        "predicted_168h"
                    ),

                "drift_rate":
                    drift_result.get(
                        "drift_rate"
                    ),

                "safety_slope":
                    drift_result.get(
                        "safety_slope"
                    ),

                "drift_risk_level":
                    drift_result.get(
                        "risk_level"
                    ),

                "drift_explanation":
                    drift_result.get(
                        "explanation"
                    )
            }


            await websocket.send_json({

                "type": "reading",

                "component_id": int(
                    component.id
                ),

                "component_code": str(
                    component.component_code
                ),

                "timestamp": (
                    reading.timestamp.isoformat()
                    if reading.timestamp
                    else None
                ),

                "temperature": float(
                    reading.temperature
                    if reading.temperature is not None
                    else 0.0
                ),

                "voltage": float(
                    reading.voltage
                    if reading.voltage is not None
                    else 0.0
                ),

                "current": float(
                    reading.current
                    if reading.current is not None
                    else 0.0
                ),

                "power": float(
                    reading.power
                    if reading.power is not None
                    else 0.0
                ),

                "leakage_current": float(
                    reading.leakage_current
                    if reading.leakage_current is not None
                    else 0.0
                ),

                "burn_in_hours": int(
                    reading.burn_in_hours
                    if reading.burn_in_hours is not None
                    else 0
                ),

                "ai": ai_result
            })


            await asyncio.sleep(2)


    except WebSocketDisconnect:

        print(
            f"WebSocket disconnected for component "
            f"{component_id}"
        )


    except Exception as error:

        print(
            f"WebSocket error: {error}"
        )


    finally:

        db.close()