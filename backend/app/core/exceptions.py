from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import logging

logger = logging.getLogger(__name__)

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle Pydantic validation errors and format them nicely.
    """
    errors = []
    for error in exc.errors():
        field = " -> ".join([str(loc) for loc in error["loc"]])
        errors.append({"field": field, "message": error["msg"]})
        
    return JSONResponse(
        status_code=422,
        content={"success": False, "message": "Validasi gagal", "details": errors}
    )

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """
    Handle global database errors.
    """
    logger.error(f"Database error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Terjadi kesalahan internal pada database"}
    )
