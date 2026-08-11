from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Kerjain API"
    ENVIRONMENT: str = "development"
    VERSION: str = "1.0.0"
    
    # Supabase PostgreSQL
    DATABASE_URL: str
    
    # JWT & Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # CORS
    CORS_ORIGINS: Union[str, List[str]] = ["http://localhost:3000"]

    # Maps API
    LOCATIONIQ_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

# Parse CORS Origins if it's a comma-separated string
if isinstance(settings.CORS_ORIGINS, str):
    settings.CORS_ORIGINS = [i.strip() for i in settings.CORS_ORIGINS.split(",")]
