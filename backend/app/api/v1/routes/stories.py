"""HTTP routes for creating and retrieving stories.

These endpoints are the thin HTTP layer. They validate request bodies,
delegate persistence to SQLAlchemy via get_db, and return Pydantic schemas.
"""

from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.story import Story
from app.schemas.story import StoryCreate, StoryRead

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
    story = Story(
        title=story_in.title,
        body=story_in.body,
    )

    db.add(story)
    db.commit()
    db.refresh(story)

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
    stories = (
        db.query(Story)
        .order_by(Story.created_at.desc())
        .all()
    )

    return [StoryRead.model_validate(story) for story in stories]


@router.get(
    "/{story_id}",
    response_model=StoryRead,
)
def get_story(
    story_id: int,
    db: Session = Depends(get_db),
) -> StoryRead:
    f"""Get one story by id.
    
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
    story = db.get(Story, story_id)

    if story is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found.",
        )

    return StoryRead.model_validate(story)