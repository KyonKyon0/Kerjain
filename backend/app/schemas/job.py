from pydantic import Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from .generic import CamelBaseModel

class JobCreate(CamelBaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    address: str = Field(..., min_length=5)
    reward_type: str = Field(..., pattern="^(FLEXIBLE|FIXED)$")
    reward_amount: Optional[float] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    category: Optional[str] = None

class JobStatusUpdate(CamelBaseModel):
    status: str

class JobResponse(CamelBaseModel):
    id: UUID
    consumer_id: UUID
    partner_id: Optional[UUID]
    title: str
    description: str
    address: str
    reward_type: str
    reward_amount: Optional[float]
    status: str
    created_at: datetime
    
    consumer_name: Optional[str] = None
    partner_name: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    category: Optional[str] = None

class JobProgressCreate(CamelBaseModel):
    status: str
    note: Optional[str] = None
    photo_url: Optional[str] = None

class JobProgressResponse(CamelBaseModel):
    id: UUID
    job_id: UUID
    status_snapshot: str
    note: Optional[str] = None
    photo_url: Optional[str] = None
    created_at: datetime

