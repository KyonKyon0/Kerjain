from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.payment import PaymentCreate, PaymentProcess, PaymentResponse
from app.repositories.payment import payment_repository
from app.repositories.job import job_repository
from app.models.user import User

class PaymentService:
    def create_payment(self, db: Session, obj_in: PaymentCreate, current_user: User) -> PaymentResponse:
        job = job_repository.get_by_id(db, str(obj_in.job_id))
        if not job:
            raise HTTPException(status_code=404, detail="Pekerjaan tidak ditemukan")
            
        if str(job.consumer_id) != str(current_user.id):
            raise HTTPException(status_code=403, detail="Akses ditolak")
            
        # Check if payment already exists
        existing = payment_repository.get_by_job_id(db, str(obj_in.job_id))
        if existing:
            return PaymentResponse.model_validate(existing)
            
        if not job.partner_id:
            raise HTTPException(status_code=400, detail="Pekerjaan belum memiliki mitra")

        payment = payment_repository.create(db, obj_in, consumer_id=current_user.id, partner_id=job.partner_id)
        
        # Auto update job status to COMPLETED when creating a payment in MVP (simplified flow)
        if job.status == "WAITING_CONFIRMATION":
            job_repository.update_status(db, job, "COMPLETED")
            
        return PaymentResponse.model_validate(payment)

    def get_payment_by_job(self, db: Session, job_id: str, current_user: User) -> PaymentResponse:
        payment = payment_repository.get_by_job_id(db, job_id)
        if not payment:
            raise HTTPException(status_code=404, detail="Data pembayaran tidak ditemukan")
            
        if str(payment.consumer_id) != str(current_user.id) and str(payment.partner_id) != str(current_user.id):
            raise HTTPException(status_code=403, detail="Akses ditolak")
            
        return PaymentResponse.model_validate(payment)

    def process_payment(self, db: Session, job_id: str, payload: PaymentProcess, current_user: User) -> PaymentResponse:
        payment = payment_repository.get_by_job_id(db, job_id)
        if not payment:
            raise HTTPException(status_code=404, detail="Data pembayaran tidak ditemukan")
            
        if str(payment.consumer_id) != str(current_user.id):
            raise HTTPException(status_code=403, detail="Hanya konsumen yang dapat membayar")
            
        if payment.status == "SUCCESS":
            raise HTTPException(status_code=400, detail="Pembayaran sudah berhasil")
            
        processed = payment_repository.process(db, payment, payload.method)
        return PaymentResponse.model_validate(processed)

payment_service = PaymentService()
