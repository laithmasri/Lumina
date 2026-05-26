"""Pydantic schemas for User entities."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class UserRead(BaseModel):
    """Public representation of a user returned by the API."""

    id: int = Field(..., description="Internal application user id.")
    email: str = Field(..., description="User email address.")
    supabase_id: str = Field(..., description="Supabase Auth user id.")
    created_at: datetime = Field(..., description="When the user was created.")

    model_config = {
        "from_attributes": True,
    }