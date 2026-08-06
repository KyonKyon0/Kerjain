from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate
from datetime import datetime, timezone

class PaymentRepository:
    def create(self, db: Session, obj_in: PaymentCreate, consumer_id: str, partner_id: str) -> Payment:
        db_obj = Payment(
            job_id=obj_in.job_id,
            consumer_id=consumer_id,
            partner_id=partner_id,
            amount=obj_in.amount,
            method="CASH", # Default placeholder
            status="UNPAID"
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_job_id(self, db: Session, job_id: str) -> Payment | None:
        return db.query(Payment).filter(Payment.job_id == job_id).first()

    def process(self, db: Session, payment: Payment, method: str) -> Payment:
        payment.method = method
        payment.status = "SUCCESS"
        payment.paid_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(payment)
        return payment

payment_repository = PaymentRepository()
