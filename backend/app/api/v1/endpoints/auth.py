from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import UserRegister, UserLogin
from app.schemas.generic import GenericResponse
from app.services.auth import auth_service

router = APIRouter()

@router.post("/register", response_model=GenericResponse)
def register(
    user_in: UserRegister,
    db: Session = Depends(get_db)
):
    res = auth_service.register(db, user_in)
    return GenericResponse(success=True, message=res["message"])

@router.post("/login", response_model=GenericResponse)
def login(
    user_in: UserLogin,
    db: Session = Depends(get_db)
):
    token_response = auth_service.login(db, user_in)
    return GenericResponse(
        success=True,
        message="Login berhasil",
        data=token_response
    )
