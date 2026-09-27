from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.component import Component
from app.models.burn_in_reading import BurnInReading
from app.schemas.reading import ReadingCreate, ReadingResponse

router = APIRouter(
    prefix="/api/readings",
    tags=["Burn-In Readings"]
)

@router.post("/", response_model=ReadingResponse)
def create_reading(
    data: ReadingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    component = db.query(Component).filter(
        Component.id == data.component_id
    ).first()

    if not component:
        raise HTTPException(
            status_code=404,
            detail="Component not found"
        )

    reading = BurnInReading(
        component_id=data.component_id,
        temperature=data.temperature,
        voltage=data.voltage,
        current=data.current,
        power=data.power,
        leakage_current=data.leakage_current,
        value_0h=data.value_0h,
        value_24h=data.value_24h,
        value_168h=data.value_168h,
        burn_in_hours=data.burn_in_hours
    )

    db.add(reading)
    db.commit()
    db.refresh(reading)

    return reading

@router.get("/{component_id}", response_model=list[ReadingResponse])
def get_readings(
    component_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    component = db.query(Component).filter(
        Component.id == component_id
    ).first()

    if not component:
        raise HTTPException(
            status_code=404,
            detail="Component not found"
        )

    return db.query(BurnInReading).filter(
        BurnInReading.component_id == component_id
    ).order_by(
        BurnInReading.timestamp.asc()
    ).all()