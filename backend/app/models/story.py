"""SQLAlchemy ORM model for stories."""

from __future__ import annotations

from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class Story(TimestampMixin, Base):
    """Database model representing a story.

    Attributes
    ----------
    id: int
        Primary key for the story.
    title: str
        Short, human-readable title for the story.
    body: Optional[str]
        Main text content of the story.
    user_id: int
        Foreign key to the owning user.
    """

    __tablename__ = "stories"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )
    title: Mapped[str] = mapped_column(
        String(length=255),
        nullable=False,
    )
    body: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    author: Mapped["User"] = relationship(
        "User",
        back_populates="stories",
    )
