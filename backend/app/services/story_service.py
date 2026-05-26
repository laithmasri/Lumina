"""Business logic for story operations.

This module contains use-case functions that interact with the database.
API routes should call these functions instead of embedding SQLAlchemy logic
directly in route handlers.
"""

from __future__ import annotations

from typing import List, Optional

from sqlalchemy.orm import Session

from app.models import Story

from app.schemas.story import StoryUpdate


def create_story(
    db: Session,
    *,
    user_id: int,
    title: str,
    body: Optional[str] = None,
) -> Story:
    """Create and persist a new story.

    Parameters
    ----------
    db: Session
        Active SQLAlchemy session for this request.
    user_id: int
        ID of the user creating the story.
    title: str
        Story title.
    body: Optional[str]
        Optional story body text.

    Returns
    -------
    Story
        The persisted story, including id and timestamps after refresh.
    """
    story = Story(
        title=title,
        body=body,
        user_id=user_id,
    )
    
    db.add(story)
    db.commit()
    db.refresh(story)
    
    return story


def delete_story(db: Session, story_id: int, user_id: int) -> bool:
    """Delete a story by primary key.

    Parameters
    ----------
    db : Session
        Active SQLAlchemy session for this request.
    story_id : int
        Primary key of the story to delete.
    user_id: int
        ID of the user to delete the story for.

    Returns
    -------
    bool
        True if a story was deleted, False if not found.
    """
    story = get_story_for_user(db, story_id, user_id)
    if story is None:
        return False

    db.delete(story)
    db.commit()
    
    return True


def get_story_for_user(db: Session, story_id: int, user_id: int) -> Optional[Story]:
    """Return one story by primary key, or None if not found.

    Parameters
    ----------
    db: Session
        Active SQLAlchemy session for this request.
    story_id: int
        Primary key of the story.
    user_id: int
        ID of the user to get the story for.

    Returns
    -------
    Optional[Story]
        The story if it exists, otherwise None.
    """
    return (
        db.query(Story)
        .filter(Story.id == story_id, Story.user_id == user_id)
        .one_or_none()
    )


def list_stories_for_user(db: Session, user_id: int) -> List[Story]:
    """Return all stories, newest first.

    Parameters
    ----------
    db: Session
        Active SQLAlchemy session for this request.
    user_id: int
        ID of the user to list stories for.

    Returns
    -------
    list[Story]
        All stories ordered by created_at descending.
    """
    return (
        db.query(Story)
        .filter(Story.user_id == user_id)
        .order_by(Story.created_at.desc())
        .all()
    )


def update_story(
    db: Session,
    story_id: int,
    user_id: int,
    updates: StoryUpdate,
) -> Optional[Story]:
    """Apply partial updates to an existing story.
    
    Parameters
    ----------
    db: Session
        Active SQLAlchemy session for this request.
    story_id: int
        Primary key of the story to update.
    user_id: int
        ID of the user to update the story for.
    updates: StoryUpdate
        Fields to update. Only set fields are applied.

    Returns
    -------
    Optional[Story]
        Updated story if found, otherwise None.
    """
    story = get_story_for_user(db, story_id, user_id)
    if story is None:
        return None

    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(story, field, value)

    db.commit()
    db.refresh(story)

    return story