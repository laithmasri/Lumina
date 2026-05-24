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
    title: str,
    body: Optional[str] = None,
) -> Story:
    """Create and persist a new story.

    Parameters
    ----------
    db: Session
        Active SQLAlchemy session for this request.
    title: str
        Story title.
    body: Optional[str]
        Optional story body text.

    Returns
    -------
    Story
        The persisted story, including id and timestamps after refresh.
    """
    story = Story(title=title, body=body)
    
    db.add(story)
    db.commit()
    db.refresh(story)
    
    return story


def delete_story(db: Session, story_id: int) -> bool:
    """Delete a story by primary key.

    Parameters
    ----------
    db : Session
        Active SQLAlchemy session for this request.
    story_id : int
        Primary key of the story to delete.

    Returns
    -------
    bool
        True if a story was deleted, False if not found.
    """
    story = get_story_by_id(db, story_id)
    if story is None:
        return False

    db.delete(story)
    db.commit()
    
    return True


def get_story_by_id(db: Session, story_id: int) -> Optional[Story]:
    """Return one story by primary key, or None if not found.

    Parameters
    ----------
    db: Session
        Active SQLAlchemy session for this request.
    story_id: int
        Primary key of the story.

    Returns
    -------
    Optional[Story]
        The story if it exists, otherwise None.
    """
    return db.get(Story, story_id)


def list_stories(db: Session) -> List[Story]:
    """Return all stories, newest first.

    Parameters
    ----------
    db: Session
        Active SQLAlchemy session for this request.

    Returns
    -------
    list[Story]
        All stories ordered by created_at descending.
    """
    return (
        db.query(Story)
        .order_by(Story.created_at.desc())
        .all()
    )


def update_story(
    db: Session,
    story_id: int,
    updates: StoryUpdate,
) -> Optional[Story]:
    """Apply partial updates to an existing story.
    
    Parameters
    ----------
    db: Session
        Active SQLAlchemy session for this request.
    story_id: int
        Primary key of the story to update.
    updates: StoryUpdate
        Fields to update. Only set fields are applied.

    Returns
    -------
    Optional[Story]
        Updated story if found, otherwise None.
    """
    story = get_story_by_id(db, story_id)
    if story is None:
        return None

    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(story, field, value)

    db.commit()
    db.refresh(story)

    return story