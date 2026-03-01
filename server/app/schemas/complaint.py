from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
class ComplaintCreate(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
class ComplaintResponse(BaseModel):
    id: int
    title: str
    description: str
    image_path: Optional[str]
    location: Optional[str]
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
