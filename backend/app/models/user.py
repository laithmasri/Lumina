"""SQLAlchemy ORM model for application users."""

from __future__ import annotations

from typing import TYPE_CHECKING
if TYPE_CHECKING:
  from app.models.story import Story

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class User(TimestampMixin, Base):
    """Database model representing a Lumina user.

    Each user is linked to a Supabase Auth account via supabase_id.
    We store email locally for convenience and querying.

    Attributes
    ----------
    id: int
        Internal primary key for this application.
    supabase_id: str
        UUID from Supabase Auth (JWT ``sub`` claim).
    email: str
        User email address from Supabase.
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )
    supabase_id: Mapped[str] = mapped_column(
        String(length=36),
        unique=True,
        index=True,
        nullable=False,
    )
    email: Mapped[str] = mapped_column(
        String(length=255),
        unique=True,
        index=True,
        nullable=False,
    )

    stories: Mapped[list["Story"]] = relationship(
        "Story",
        back_populates="author",
    )