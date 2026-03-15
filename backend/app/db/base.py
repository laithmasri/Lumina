"""SQLAlchemy base class and shared mixins for ORM models."""

from datetime import datetime

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    """Declarative base class for all ORM objects."""
    pass


class TimestampMixin:
    """Mixin that adds created_at and updated_at timestamp column.
    
    Attributes
    ----------
    created_at: datetime
        UTC timestamp when the row was first created.
    updated_at: datetime
        UTC timestamp when the row was last updated.
    """

    created_at: Mapped[datetime] = mapped_column(
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )