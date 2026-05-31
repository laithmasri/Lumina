"""make story user_id not null

Revision ID: c4f8e2a1b903
Revises: 92e3a32b1c3a
Create Date: 2026-05-31 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c4f8e2a1b903"
down_revision: Union[str, Sequence[str], None] = "92e3a32b1c3a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove orphan stories, then enforce user_id NOT NULL."""
    # Safety net: delete any rows that would block the constraint.
    # (Harmless if you already cleaned up in 6B.2.)
    op.execute("DELETE FROM stories WHERE user_id IS NULL")

    op.alter_column(
        "stories",
        "user_id",
        existing_type=sa.Integer(),
        nullable=False,
    )


def downgrade() -> None:
    """Allow NULL user_id again (rollback only)."""
    op.alter_column(
        "stories",
        "user_id",
        existing_type=sa.Integer(),
        nullable=True,
    )