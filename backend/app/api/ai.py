from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.drift_predictor import predict_drift
from app.services.anomaly_detector import detect_anomaly
from app.core.dependencies import get_db, get_current_user
from app.models.component import Component
from app.models.burn_in_reading import BurnInReading


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Analysis"]
)


@router.get("/anomaly/{component_id}")
def analyze_component(
    component_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    component = (
        db.query(Component)
        .filter(Component.id == component_id)
        .first()
    )

    if not component:
        raise HTTPException(
            status_code=404,
            detail="Component not found"
        )

    readings = (
        db.query(BurnInReading)
        .filter(BurnInReading.component_id == component_id)
        .order_by(BurnInReading.timestamp.asc())
        .all()
    )

    if not readings:
        raise HTTPException(
            status_code=404,
            detail="No burn-in readings found for this component"
        )

    result = detect_anomaly(readings)

    return {
        "component_id": component.id,
        "component_code": component.component_code,
        "component_type": component.component_type,
        **result
    }


@router.get("/drift/{component_id}")
def predict_component_drift(
    component_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    component = (
        db.query(Component)
        .filter(Component.id == component_id)
        .first()
    )

    if not component:
        raise HTTPException(
            status_code=404,
            detail="Component not found"
        )

    reading = (
        db.query(BurnInReading)
        .filter(BurnInReading.component_id == component_id)
        .order_by(BurnInReading.timestamp.desc())
        .first()
    )

    if not reading:
        raise HTTPException(
            status_code=404,
            detail="No burn-in reading found for this component"
        )

    result = predict_drift(
        reading.value_0h,
        reading.value_24h
    )

    return {
        "component_id": component.id,
        "component_code": component.component_code,
        "component_type": component.component_type,
        **result
    }