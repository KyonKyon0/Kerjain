from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserResponse
from app.repositories.user import user_repository
from app.utils.security import verify_password, create_access_token

class AuthService:
    def register(self, db: Session, obj_in: UserRegister) -> dict:
        existing_user = user_repository.get_by_email(db, obj_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email sudah terdaftar"
            )
        
        user_repository.create(db, obj_in)
        return {"success": True, "message": "Registrasi berhasil"}

    def login(self, db: Session, obj_in: UserLogin) -> TokenResponse:
        user = user_repository.get_by_email(db, obj_in.email)
        if not user or not verify_password(obj_in.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau password salah"
            )
        
        access_token = create_access_token(subject=user.id)
        
        return TokenResponse(
            user=UserResponse.model_validate(user),
            token=access_token,
            role=user.role
        )

auth_service = AuthService()
