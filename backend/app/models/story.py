"""SQLAlchemy ORM model for stories."""

from typing import Optional

from sqlalchemy import Integer, String, Text 
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class Story(TimestampMixin, Base):
    """Database model representing a story.
    
    Attributes
    ----------
    id: Integer
        Represents the primary key for the story.
    title: String
        A short, human-readable title for the story.
    body:
        The main text content of the story.
    """

    __tablename__ = "stories"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )
    title: Mapped[str] = mapped_column(
        String(length=225),
        nullable=False,
    )
    body: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )