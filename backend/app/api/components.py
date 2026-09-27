from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.component import Component
from app.schemas.component import ComponentCreate, ComponentResponse

router = APIRouter(
    prefix="/api/components",
    tags=["Components"]
)

@router.post("/", response_model=ComponentResponse)
def create_component(
    data: ComponentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing = db.query(Component).filter(
        Component.component_code == data.component_code
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Component code already exists"
        )

    component = Component(
        component_code=data.component_code,
        component_type=data.component_type,
        manufacturer=data.manufacturer,
        batch_number=data.batch_number,
        lot_number=data.lot_number,
        created_by=current_user.id
    )

    db.add(component)
    db.commit()
    db.refresh(component)

    return component

@router.get("/", response_model=list[ComponentResponse])
def get_components(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Component).order_by(
        Component.id.desc()
    ).all()

@router.get("/{component_id}", response_model=ComponentResponse)
def get_component(
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

    return component