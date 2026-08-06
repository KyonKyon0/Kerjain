from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.exceptions import validation_exception_handler, sqlalchemy_exception_handler

def create_app() -> FastAPI:
    """
    Application factory pattern for FastAPI.
    Sets up CORS, Exception Handlers, and Routers.
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="REST API Foundation for Kerjain",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
    )

    # Setup CORS (Cross-Origin Resource Sharing)
    if settings.CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.CORS_ORIGINS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Register Global Exception Handlers
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)

    # Health Check Endpoint
    @app.get("/health", tags=["System"])
    async def health_check():
        return {"status": "ok", "message": "Backend is running smoothly!"}

    # API Router Registration
    from app.api.v1.api import api_router
    app.include_router(api_router, prefix="/api/v1")

    return app

app = create_app()
