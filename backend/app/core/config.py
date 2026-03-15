"""This module defines the Settings class, which loads configuration values from environment variables."""

from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Loads configuration values from environment variables.

    Attributes
    ----------
    BACKEND_CORS_ORIGINS : List[str]
        The list of origins that are allowed to access the API.
    DATABASE_URL : str
        The URL of the database.
    PROJECT_NAME : str
        The name of the project.
    """

    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/lumina"
    PROJECT_NAME: str = "Lumina API"

    class Config:
        """Inner configuration for how environment variables are loaded.

        Attributes
        ----------
        env_file : str
            The path to the environment file.
        """

        env_file: str = ".env"


settings = Settings()