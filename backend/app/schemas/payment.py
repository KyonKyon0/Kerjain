from pydantic import Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from .generic import CamelBaseModel

class PaymentCreate(CamelBaseModel):
    job_id: UUID
    amount: float

class PaymentProcess(CamelBaseModel):
    method: str = Field(..., pattern="^(VA|QRIS|TRANSFER|CASH)$")

class PaymentResponse(CamelBaseModel):
    id: UUID
    job_id: UUID
    consumer_id: UUID
    partner_id: UUID
    amount: float
    method: str
    status: str
    created_at: datetime
    paid_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
