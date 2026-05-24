"""Pydantic schemas for Story entities.

These schemas define the shape of data at the API boundary for story
creation and reading. They are decoupled from the SQLAlchemy model so the
HTTP layer stays independent of persistence details.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class StoryBase(BaseModel):
    """Fields shared by create and read schemas."""

    title: str = Field(
        ...,
        description="Short, human-readable title for the story.",
        max_length=255,
    )

    body: Optional[str] = Field(
        default=None,
        description="Main text content of the story.",
    )


class StoryCreate(StoryBase):
    """Payload schema for creating a new story.
    
    Used as the request body for POST api/v1/stories.
    Does not include id or timestamps because those are
    set by the database.
    """


class StoryRead(StoryBase):
    """Response schema for reading story data.
    
    Does not include id or timestamps because those are
    set by the database.
    """

    id: int = Field(
        ...,
        description="Unique identifier for the story.",
    )

    created_at: datetime = Field(
        ...,
        description="UTC timestamp when the story was created.",
    )

    updated_at: datetime = Field(
        ...,
        description="UTC timestamp when the story was last updated.",
    )

    model_config = {
        "from_attributes": True,
    }


class StoryUpdate(BaseModel):
    """Payload schema for partially updating a story.
    
    All fields are optional. Only fields included in the request body
    are updated, omotted fields are left unchanged.
    """

    title: Optional[str] = Field(
        default=None,
        description="Updated story title.",
        max_length=255,
    )

    body: Optional[str] = Field(
        default=None,
        description="Updated story body text.",
    )