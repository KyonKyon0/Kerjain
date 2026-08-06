import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    consumer_id = Column(String, ForeignKey("users.id"), nullable=False)
    partner_id = Column(String, ForeignKey("users.id"), nullable=True)
    
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    address = Column(String, nullable=False)
    
    reward_type = Column(String, nullable=False) # "FLEXIBLE" or "FIXED"
    reward_amount = Column(Float, nullable=True)
    
    status = Column(String, nullable=False, default="PUBLISHED")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Simple coordinates mapping for distance matching (radius)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    category = Column(String, nullable=True)
    
    # Relationships
    consumer = relationship("User", foreign_keys=[consumer_id], back_populates="jobs_created")
    partner = relationship("User", foreign_keys=[partner_id], back_populates="jobs_taken")
    payments = relationship("Payment", back_populates="job")
    progress_logs = relationship("JobProgress", back_populates="job", cascade="all, delete-orphan", order_by="JobProgress.created_at")
