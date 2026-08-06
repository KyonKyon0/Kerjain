from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.models.job import Job
from app.models.user import User
from app.schemas.job import JobCreate

class JobRepository:
    def create(self, db: Session, obj_in: JobCreate, consumer_id: str) -> Job:
        db_obj = Job(
            consumer_id=consumer_id,
            title=obj_in.title,
            description=obj_in.description,
            address=obj_in.address,
            reward_type=obj_in.reward_type,
            reward_amount=obj_in.reward_amount,
            lat=obj_in.lat,
            lng=obj_in.lng,
            category=obj_in.category,
            status="PUBLISHED"
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_id(self, db: Session, job_id: str) -> Job | None:
        return db.query(Job).filter(Job.id == job_id).first()
        
    def get_by_id_with_lock(self, db: Session, job_id: str) -> Job | None:
        # Row-level lock (FOR UPDATE) to prevent race conditions during accept
        return db.query(Job).filter(Job.id == job_id).with_for_update().first()

    def get_all(
        self, 
        db: Session, 
        keyword: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
        consumer_id: Optional[str] = None,
        partner_id: Optional[str] = None
    ) -> List[Job]:
        query = db.query(Job)
        
        if keyword:
            query = query.filter(
                or_(
                    Job.title.ilike(f"%{keyword}%"),
                    Job.description.ilike(f"%{keyword}%")
                )
            )
        if category:
            query = query.filter(Job.category == category)
        if status:
            query = query.filter(Job.status == status)
        if consumer_id:
            query = query.filter(Job.consumer_id == consumer_id)
        if partner_id:
            query = query.filter(Job.partner_id == partner_id)
            
        return query.order_by(Job.created_at.desc()).all()

    def update_status(self, db: Session, job: Job, status: str) -> Job:
        job.status = status
        db.commit()
        db.refresh(job)
        return job

    def assign_partner(self, db: Session, job: Job, partner_id: str) -> Job:
        job.partner_id = partner_id
        job.status = "ACCEPTED"
        db.commit()
        db.refresh(job)
        return job

job_repository = JobRepository()
