from pydantic import BaseModel

class ReadingCreate(BaseModel):
    component_id: int
    temperature: float
    voltage: float
    current: float
    power: float
    leakage_current: float | None = None
    value_0h: float | None = None
    value_24h: float | None = None
    value_168h: float | None = None
    burn_in_hours: float = 0

class ReadingResponse(BaseModel):
    id: int
    component_id: int
    temperature: float
    voltage: float
    current: float
    power: float
    leakage_current: float | None
    value_0h: float | None
    value_24h: float | None
    value_168h: float | None
    burn_in_hours: float

    model_config = {
        "from_attributes": True
    }