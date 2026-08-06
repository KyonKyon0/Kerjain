from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.payment import PaymentCreate, PaymentProcess, PaymentResponse
from app.schemas.generic import GenericResponse
from app.models.user import User
from app.api.deps import get_current_user, RequireRole
from app.services.payment import payment_service

router = APIRouter()

@router.post("/", response_model=GenericResponse)
def create_payment(
    payment_in: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["consumer"]))
):
    payment = payment_service.create_payment(db, payment_in, current_user)
    return GenericResponse(success=True, message="Tagihan berhasil dibuat", data=payment)

@router.get("/{job_id}", response_model=GenericResponse)
def get_payment(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payment = payment_service.get_payment_by_job(db, job_id, current_user)
    return GenericResponse(success=True, message="Detail pembayaran", data=payment)

@router.post("/{job_id}/pay", response_model=GenericResponse)
def process_payment(
    job_id: str,
    payload: PaymentProcess,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["consumer"]))
):
    payment = payment_service.process_payment(db, job_id, payload, current_user)
    return GenericResponse(success=True, message="Pembayaran berhasil", data=payment)
