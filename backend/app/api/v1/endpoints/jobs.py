from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.schemas.job import JobCreate, JobStatusUpdate
from app.schemas.generic import GenericResponse
from app.models.user import User
from app.api.deps import get_current_user, RequireRole
from app.services.job import job_service

router = APIRouter()

@router.post("", response_model=GenericResponse)
def create_job(
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["consumer"]))
):
    job = job_service.create_job(db, job_in, current_user)
    return GenericResponse(success=True, message="Pekerjaan berhasil dibuat", data=job)

@router.get("/my", response_model=GenericResponse)
def get_my_jobs(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["consumer"]))
):
    jobs = job_service.get_jobs(db, None, None, status, "my-jobs", current_user)
    return GenericResponse(success=True, message="Daftar pekerjaan saya", data=jobs)

@router.get("/assigned", response_model=GenericResponse)
def get_assigned_jobs(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["partner"]))
):
    jobs = job_service.get_jobs(db, None, None, status, "partner-jobs", current_user)
    return GenericResponse(success=True, message="Daftar pekerjaan ditugaskan", data=jobs)

@router.get("", response_model=GenericResponse)
def get_jobs(
    keyword: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    type: Optional[str] = Query(None, description="my-jobs or partner-jobs"),
    radius: Optional[float] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Note: spatial radius search is simplified to normal query in MVP
    jobs = job_service.get_jobs(db, keyword, category, status, type, current_user)
    return GenericResponse(success=True, message="Daftar pekerjaan", data=jobs)

@router.get("/{id}", response_model=GenericResponse)
def get_job(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = job_service.get_job_by_id(db, id, current_user)
    return GenericResponse(success=True, message="Detail pekerjaan", data=job)

@router.post("/{id}/accept", response_model=GenericResponse)
def accept_job(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["partner"]))
):
    job = job_service.accept_job(db, id, current_user)
    return GenericResponse(success=True, message="Pekerjaan berhasil diambil", data=job)

@router.patch("/{id}/start", response_model=GenericResponse)
def start_job(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["partner"]))
):
    job = job_service.update_status(db, id, "IN_PROGRESS", current_user)
    return GenericResponse(success=True, message="Pekerjaan dimulai", data=job)

@router.patch("/{id}/finish", response_model=GenericResponse)
def finish_job(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["partner"]))
):
    job = job_service.update_status(db, id, "WAITING_CONFIRMATION", current_user)
    return GenericResponse(success=True, message="Pekerjaan selesai, menunggu konfirmasi", data=job)

@router.patch("/{id}/confirm", response_model=GenericResponse)
def confirm_job(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["consumer"]))
):
    job = job_service.update_status(db, id, "COMPLETED", current_user)
    return GenericResponse(success=True, message="Pekerjaan dikonfirmasi selesai", data=job)

@router.patch("/{id}/revise", response_model=GenericResponse)
def revise_job(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["consumer"]))
):
    job = job_service.update_status(db, id, "IN_PROGRESS", current_user)
    return GenericResponse(success=True, message="Pekerjaan dikembalikan untuk revisi", data=job)

@router.patch("/{id}/cancel", response_model=GenericResponse)
def cancel_job(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = job_service.update_status(db, id, "CANCELLED", current_user)
    return GenericResponse(success=True, message="Pekerjaan dibatalkan", data=job)

from app.schemas.job import JobProgressCreate

@router.post("/{id}/progress", response_model=GenericResponse)
def add_progress(
    id: str,
    payload: JobProgressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["partner"]))
):
    progress = job_service.add_progress(db, id, payload, current_user)
    return GenericResponse(success=True, message="Progres berhasil ditambahkan", data=progress)

@router.get("/{id}/timeline", response_model=GenericResponse)
def get_timeline(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    timeline = job_service.get_job_timeline(db, id, current_user)
    return GenericResponse(success=True, message="Timeline pekerjaan", data=timeline)

@router.patch("/{id}/status", response_model=GenericResponse)
def update_status(
    id: str,
    payload: JobStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = job_service.update_status(db, id, payload.status, current_user)
    return GenericResponse(success=True, message="Status berhasil diperbarui", data=job)
