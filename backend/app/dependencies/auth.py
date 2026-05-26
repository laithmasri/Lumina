"""FastAPI dependencies for authentication."""

from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import TokenValidationError, decode_access_token
from app.db.session import get_db
from app.models import Story, User  # noqa: F401 — ensure ORM models are registered
from app.services import user_service

http_bearer = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
    db: Session = Depends(get_db),
) -> User:
    """Resolve the authenticated user from a Supabase JWT.

    Expects header: Authorization: Bearer <access_token>

    Parameters
    ----------
    credentials: HTTPAuthorizationCredentials
        Parsed Authorization header provided by HTTPBearer.
    db: Session
        Database session for this request.

    Returns
    -------
    User
        The application user linked to the Supabase account.

    Raises
    ------
    HTTPException
        401 if the token is missing, invalid, or lacks required claims.
    """
    try:
        payload = decode_access_token(credentials.credentials)
    except TokenValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    supabase_id = payload.get("sub")
    email = payload.get("email")

    if not supabase_id or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing required user claims.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_service.get_or_create_user(
        db,
        supabase_id=supabase_id,
        email=email,
    )