import random
from datetime import datetime, timedelta

from app.models.burn_in_reading import BurnInReading


def generate_readings(
    db,
    component_id: int,
    scenario: str = "normal",
    points: int = 8
):
    base_temperature = 70.0
    base_voltage = 5.0
    base_current = 2.0
    base_leakage = 10.0

    readings = []

    start_time = datetime.utcnow() - timedelta(
        hours=(points - 1) * 24
    )

    for index in range(points):
        burn_in_hours = index * 24

        temperature = (
            base_temperature
            + index * 0.4
            + random.uniform(-0.5, 0.5)
        )

        voltage = (
            base_voltage
            + random.uniform(-0.03, 0.03)
        )

        current = (
            base_current
            + random.uniform(-0.05, 0.05)
        )

        leakage = (
            base_leakage
            + index * 0.15
            + random.uniform(-0.2, 0.2)
        )

        if scenario == "warning":
            temperature += index * 1.5
            leakage += index * 1.0

        elif scenario == "critical":
            temperature += index * 3.0
            leakage += index * 3.0
            current += index * 0.08

        power = voltage * current

        value_0h = base_leakage

        value_24h = (
            base_leakage
            + 0.8
            + random.uniform(-0.1, 0.1)
        )

        value_168h = leakage

        reading = BurnInReading(
            component_id=component_id,
            timestamp=(
                start_time
                + timedelta(hours=burn_in_hours)
            ),
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
            value_0h=round(
                value_0h,
                3
            ),
            value_24h=round(
                value_24h,
                3
            ),
            value_168h=round(
                value_168h,
                3
            ),
            burn_in_hours=burn_in_hours
        )

        db.add(reading)
        readings.append(reading)

    db.commit()

    for reading in readings:
        db.refresh(reading)

    return readings