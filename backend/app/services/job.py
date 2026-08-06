from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from app.schemas.job import JobCreate, JobResponse, JobProgressCreate, JobProgressResponse
from app.models.job_progress import JobProgress
from app.repositories.job import job_repository
from app.models.user import User

class JobService:
    VALID_TRANSITIONS = {
        "PUBLISHED": ["ACCEPTED", "CANCELLED"],
        "ACCEPTED": ["ON_THE_WAY", "CANCELLED"],
        "ON_THE_WAY": ["WORKING", "CANCELLED"],
        "WORKING": ["WAITING_CONFIRMATION", "CANCELLED"],
        "WAITING_CONFIRMATION": ["COMPLETED", "WORKING"],
    }

    def create_job(self, db: Session, obj_in: JobCreate, current_user: User) -> JobResponse:
        job = job_repository.create(db, obj_in, consumer_id=current_user.id)
        return self._format_job_response(job)

    def get_jobs(self, db: Session, keyword: Optional[str], category: Optional[str], status: Optional[str], type: Optional[str], current_user: User) -> List[JobResponse]:
        consumer_id = None
        partner_id = None
        
        if current_user.role == "consumer":
            consumer_id = str(current_user.id)
        elif current_user.role == "partner":
            if type == "partner-jobs":
                partner_id = str(current_user.id)
            else:
                status = "PUBLISHED"
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
            
        jobs = job_repository.get_all(
            db, 
            keyword=keyword, 
            category=category, 
            status=status,
            consumer_id=consumer_id,
            partner_id=partner_id
        )
        return [self._format_job_response(j) for j in jobs]

    def get_job_by_id(self, db: Session, job_id: str, current_user: User) -> JobResponse:
        job = job_repository.get_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pekerjaan tidak ditemukan")
            
        if current_user.role == "consumer" and str(job.consumer_id) != str(current_user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
            
        if current_user.role == "partner" and job.status != "PUBLISHED" and str(job.partner_id) != str(current_user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
            
        return self._format_job_response(job)

    def accept_job(self, db: Session, job_id: str, current_user: User) -> JobResponse:
        # Prevent race condition using FOR UPDATE lock
        job = job_repository.get_by_id_with_lock(db, job_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pekerjaan tidak ditemukan")
            
        if job.status != "PUBLISHED":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Pekerjaan sudah diambil oleh orang lain")
            
        if job.consumer_id == current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tidak bisa mengambil pekerjaan sendiri")
            
        updated_job = job_repository.assign_partner(db, job, current_user.id)
        return self._format_job_response(updated_job)

    def update_status(self, db: Session, job_id: str, new_status: str, current_user: User) -> JobResponse:
        job = job_repository.get_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pekerjaan tidak ditemukan")
            
        if job.partner_id != current_user.id and job.consumer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
            
        if job.status == new_status:
            return self._format_job_response(job)
            
        allowed_next = self.VALID_TRANSITIONS.get(job.status, [])
        if new_status not in allowed_next:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Transisi status dari {job.status} ke {new_status} tidak valid")
            
        updated_job = job_repository.update_status(db, job, new_status)
        
        # Add minimal progress log on status change
        progress = JobProgress(
            job_id=updated_job.id,
            status_snapshot=new_status,
            note=f"Status diperbarui menjadi {new_status}"
        )
        db.add(progress)
        db.commit()
        
        return self._format_job_response(updated_job)

    def add_progress(self, db: Session, job_id: str, obj_in: JobProgressCreate, current_user: User) -> JobProgressResponse:
        job = job_repository.get_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pekerjaan tidak ditemukan")
            
        if str(job.partner_id) != str(current_user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
            
        progress = JobProgress(
            job_id=job.id,
            status_snapshot=obj_in.status,
            note=obj_in.note,
            photo_url=obj_in.photo_url
        )
        db.add(progress)
        
        # Update job status if different
        if job.status != obj_in.status:
            allowed_next = self.VALID_TRANSITIONS.get(job.status, [])
            if obj_in.status in allowed_next:
                job.status = obj_in.status
        
        db.commit()
        db.refresh(progress)
        
        return JobProgressResponse(
            id=progress.id,
            job_id=progress.job_id,
            status_snapshot=progress.status_snapshot,
            note=progress.note,
            photo_url=progress.photo_url,
            created_at=progress.created_at
        )

    def get_job_timeline(self, db: Session, job_id: str, current_user: User) -> List[JobProgressResponse]:
        job = job_repository.get_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pekerjaan tidak ditemukan")
            
        if current_user.role == "consumer" and str(job.consumer_id) != str(current_user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
            
        if current_user.role == "partner" and job.status != "PUBLISHED" and str(job.partner_id) != str(current_user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
            
        logs = db.query(JobProgress).filter(JobProgress.job_id == job_id).order_by(JobProgress.created_at.desc()).all()
        return [
            JobProgressResponse(
                id=log.id,
                job_id=log.job_id,
                status_snapshot=log.status_snapshot,
                note=log.note,
                photo_url=log.photo_url,
                created_at=log.created_at
            ) for log in logs
        ]

    def _format_job_response(self, job) -> JobResponse:
        return JobResponse(
            id=job.id,
            consumer_id=job.consumer_id,
            partner_id=job.partner_id,
            title=job.title,
            description=job.description,
            address=job.address,
            reward_type=job.reward_type,
            reward_amount=job.reward_amount,
            status=job.status,
            created_at=job.created_at,
            consumer_name=job.consumer.name if job.consumer else None,
            partner_name=job.partner.name if job.partner else None
        )

job_service = JobService()
