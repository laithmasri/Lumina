"""Business logic for user operations."""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.models import User


def get_or_create_user(
    db: Session,
    *,
    supabase_id: str,
    email: str,
) -> User:
    """Return an existing user or create one from Supabase auth data.

    On first login, we mirror Supabase identity into our local users table.
    Later requests reuse the same row.

    Parameters
    ----------
    db: Session
        Active SQLAlchemy session for this request.
    supabase_id: str
        Supabase Auth user id (JWT ``sub`` claim).
    email: str
        User email from the JWT.

    Returns
    -------
    User
        The existing or newly created application user.
    """
    user = (
        db.query(User)
        .filter(User.supabase_id == supabase_id)
        .one_or_none()
    )

    if user is not None:
        return user

    user = User(
        supabase_id=supabase_id,
        email=email,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user