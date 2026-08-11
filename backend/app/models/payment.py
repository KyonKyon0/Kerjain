import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    consumer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    partner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    amount = Column(Float, nullable=False)
    method = Column(String, nullable=False) # "VA", "QRIS", "TRANSFER", "CASH"
    status = Column(String, nullable=False, default="UNPAID") # "UNPAID", "SUCCESS", "FAILED"
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    paid_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    job = relationship("Job", back_populates="payments")
    consumer = relationship("User", foreign_keys=[consumer_id])
    partner = relationship("User", foreign_keys=[partner_id])
