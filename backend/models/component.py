from pydantic import BaseModel

class ComponentCreate(BaseModel):
    component_code: str
    component_type: str
    manufacturer: str | None = None
    batch_number: str | None = None
    lot_number: str | None = None

class ComponentResponse(BaseModel):
    id: int
    component_code: str
    component_type: str
    manufacturer: str | None
    batch_number: str | None
    lot_number: str | None
    status: str

    model_config = {
        "from_attributes": True
    }