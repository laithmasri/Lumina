"""Main FastAPI application entrypoint for the Lumina backend."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import settings


app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/health", tags=["health"])
def health_check() -> Dict[str, str]:
    """Return a simple health status for the API.

    The endpoint is used by monitoring systems, the frontend application, and
    developers to verify that the backend process is running and able to serve
    HTTP requests.

    Returns
    -------
    Dict[str, str]
        A dictionary containing a simple status flag and the service name.
    """

    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
    }
