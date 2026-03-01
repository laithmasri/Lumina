"""This module defines the Settings class, which loads configuration values from environment variables."""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Loads configuration values from environment variables.

    Attributes
    ----------
    PROJECT_NAME : str
        The name of the project.
    BACKEND_CORS_ORIGINS : List[str]
        The list of origins that are allowed to access the API.
    """

    PROJECT_NAME: str = "Lumina API"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        """Inner configuration for how environment variables are loaded.

        Attributes
        ----------
        env_file : str
            The path to the environment file.
        """

        env_file: str = ".env"


settings = Settings()