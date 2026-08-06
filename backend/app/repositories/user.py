from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import UserRegister
from app.utils.security import get_password_hash

class UserRepository:
    def get_by_email(self, db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    def get_by_id(self, db: Session, user_id: str) -> User | None:
        return db.query(User).filter(User.id == user_id).first()

    def create(self, db: Session, obj_in: UserRegister) -> User:
        db_obj = User(
            name=obj_in.name,
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            role=obj_in.role,
            phone=obj_in.phone,
            address=obj_in.address
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

user_repository = UserRepository()
