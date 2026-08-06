from fastapi import APIRouter, Depends
from app.schemas.generic import GenericResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("", response_model=GenericResponse)
def get_notifications(current_user: User = Depends(get_current_user)):
    return GenericResponse(success=True, message="Daftar notifikasi", data=[])
