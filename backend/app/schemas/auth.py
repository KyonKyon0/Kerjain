from pydantic import EmailStr, Field
from typing import Optional
from uuid import UUID
from .generic import CamelBaseModel

class UserRegister(CamelBaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: str = Field(..., pattern="^(consumer|partner)$")
    phone: Optional[str] = None
    address: Optional[str] = None

class UserLogin(CamelBaseModel):
    email: EmailStr
    password: str

class UserResponse(CamelBaseModel):
    id: UUID
    name: str
    email: EmailStr
    role: str
    phone: Optional[str] = None
    address: Optional[str] = None
    address: Optional[str] = None

class TokenResponse(CamelBaseModel):
    user: UserResponse
    token: str
    role: str
