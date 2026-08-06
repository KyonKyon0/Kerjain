import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

from sqlalchemy.dialects.postgresql import UUID

class JobProgress(Base):
    __tablename__ = "job_progress_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    
    status_snapshot = Column(String, nullable=False)
    note = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    job = relationship("Job", back_populates="progress_logs")
