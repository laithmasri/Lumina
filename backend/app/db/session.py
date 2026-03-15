"""A file for database engine and session management.

This module creates a SQLAlchemy engine based on the configured DATABASE_URL and
exposes a session factory.
"""

from collections.abc import Generator
from enum import auto

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

# Responsible for managing the connection pool & communicating with PostgreSQL.
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        pool_pre_ping=True,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
    )

# Create new Session instances. Each request to the API will use its own session.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    """Yield a database session for use in FastAPI dependencies.
    
    Create a new session for each request and ensures that the session is closed
    after the request is handled, even if an exception occurs.

    Yields
    ------
    Session
        A SQLAlchemy Session object bound to the configured engine. 
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


