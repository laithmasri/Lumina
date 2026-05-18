"""Aggregate API routers for the Lumina backend."""

from fastapi import APIRouter

from app.api.v1.routes.stories import router as stories_router

api_router = APIRouter()
api_router.include_router(
    stories_router,
    prefix="/v1/stories",
    tags=["stories"],
)