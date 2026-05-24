"""HTTP routes for creating and retrieving stories.

These endpoints are the thin HTTP layer. They validate request bodies,
delegate persistence to SQLAlchemy via get_db, and return Pydantic schemas.
"""

from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.story import StoryCreate, StoryRead, StoryUpdate
from app.services import story_service

router = APIRouter()


@router.post(
    "",
    response_model=StoryRead,
    status_code=status.HTTP_201_CREATED,
)
def create_story(
    story_in: StoryCreate,
    db: Session = Depends(get_db),
) -> StoryRead:
    """Create and persist a new story.
    
    Parameters
    ----------
    story_in: StoryCreate
        Validate request body (title, body(optional)).
    db: Session
        Database session injected by FastAPI.

    Returns
    -------
    StoryRead
        The created story including id and timestamps.
    """
    story = story_service.create_story(
        db,
        title=story_in.title,
        body=story_in.body,
    )
    return StoryRead.model_validate(story)


@router.delete(
    "/{story_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_story(
    story_id: int,
    db: Session = Depends(get_db),
) -> None:
    """Delete a story by id."""
    deleted = story_service.delete_story(db, story_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found.",
        )


@router.get(
    "/{story_id}",
    response_model=StoryRead,
)
def get_story(
    story_id: int,
    db: Session = Depends(get_db),
) -> StoryRead:
    """Get one story by id.
    
    Parameters
    ----------
    story_id: int
        The id of the story.
    db: Session
        Database session injected by FastAPI.

    Returns
    -------
    StoryRead
        The story queried by id.

    Raises
    ------
    HTTPException
        404 if the story does not exist.
    """
    story = story_service.get_story_by_id(db, story_id)

    if story is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found.",
        )

    return StoryRead.model_validate(story)


@router.get(
    "",
    response_model=List[StoryRead],
)
def list_stories(
    db: Session = Depends(get_db),
) -> List[StoryRead]:
    """Return all stories, newest first.
    
    Parameters
    ----------
    db: Session
        Database session injected by FastAPI.

    Returns
    -------
    List[StoryRead]
        A list of StoryRead objects.
    """
    stories = story_service.list_stories(db)
    return [StoryRead.model_validate(story) for story in stories]


@router.patch(
    "/{story_id}",
    response_model=StoryRead,
)
def update_story(
    story_id: int,
    story_in: StoryUpdate,
    db: Session = Depends(get_db),
) -> StoryRead:
    """Partially update a story by id."""
    story = story_service.update_story(db, story_id, story_in)

    if story is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found.",
        )

    return StoryRead.model_validate(story)