from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_db,
    get_current_user
)

from app.models.component import Component

from app.services.synthetic_generator import (
    generate_readings
)


router = APIRouter(
    prefix="/api/simulator",
    tags=["Synthetic Burn-In Simulator"]
)


@router.post("/generate/{component_id}")
def generate_component_data(
    component_id: int,
    scenario: str = "normal",
    points: int = 8,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    component = (
        db.query(Component)
        .filter(
            Component.id == component_id
        )
        .first()
    )

    if not component:
        raise HTTPException(
            status_code=404,
            detail="Component not found"
        )

    allowed_scenarios = [
        "normal",
        "warning",
        "critical"
    ]

    if scenario not in allowed_scenarios:
        raise HTTPException(
            status_code=400,
            detail=(
                "Scenario must be "
                "normal, warning or critical"
            )
        )

    if points < 2 or points > 50:
        raise HTTPException(
            status_code=400,
            detail="Points must be between 2 and 50"
        )

    readings = generate_readings(
        db=db,
        component_id=component_id,
        scenario=scenario,
        points=points
    )

    return {
        "message": (
            "Synthetic burn-in data "
            "generated successfully"
        ),
        "component_id": component.id,
        "component_code": component.component_code,
        "scenario": scenario,
        "points_generated": len(readings),
        "label": (
            "Synthetic Burn-In Data — "
            "For Hackathon Demonstration"
        )
    }