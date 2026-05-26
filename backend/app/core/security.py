"""JWT verification helpers for Supabase-issued access tokens."""

from __future__ import annotations

import ssl
from functools import lru_cache
from typing import Any, Dict

import certifi
import jwt
from jwt import PyJWKClient
from jwt.exceptions import InvalidTokenError, PyJWKClientConnectionError, PyJWKClientError

from app.core.config import settings


class TokenValidationError(Exception):
    """Raised when a JWT cannot be verified or is missing required claims."""


def _normalize_supabase_url(url: str) -> str:
    """Return the Supabase project base URL without REST path suffixes."""
    cleaned = url.strip().rstrip("/")
    if cleaned.endswith("/rest/v1"):
        cleaned = cleaned[: -len("/rest/v1")]
    return cleaned


def _require_supabase_base_url() -> str:
    """Return a validated Supabase project base URL or raise."""
    base_url = _normalize_supabase_url(settings.SUPABASE_URL)
    if not base_url.startswith("https://"):
        raise TokenValidationError(
            "SUPABASE_URL is missing or invalid in backend/.env. "
            "Expected https://<project-ref>.supabase.co"
        )
    return base_url


@lru_cache
def _get_jwks_client(supabase_base_url: str) -> PyJWKClient:
    """Return a cached JWKS client for a given Supabase project URL."""
    jwks_url = f"{supabase_base_url}/auth/v1/.well-known/jwks.json"
    ssl_context = ssl.create_default_context(cafile=certifi.where())
    return PyJWKClient(jwks_url, ssl_context=ssl_context)


def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and verify a Supabase access token.

    Parameters
    ----------
    token : str
        Raw JWT string from the Authorization header.

    Returns
    -------
    dict[str, Any]
        Verified JWT payload.

    Raises
    ------
    TokenValidationError
        If the token is invalid, expired, or fails verification.
    """
    base_url = _require_supabase_base_url()
    issuer = f"{base_url}/auth/v1"

    try:
        if settings.SUPABASE_JWT_SECRET:
            header = jwt.get_unverified_header(token)
            if header.get("alg") == "HS256":
                return jwt.decode(
                    token,
                    settings.SUPABASE_JWT_SECRET,
                    algorithms=["HS256"],
                    audience="authenticated",
                    issuer=issuer,
                )

        signing_key = _get_jwks_client(base_url).get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
            issuer=issuer,
        )
    except PyJWKClientConnectionError as exc:
        raise TokenValidationError(
            "Unable to reach Supabase JWKS endpoint. Check SUPABASE_URL."
        ) from exc
    except PyJWKClientError as exc:
        raise TokenValidationError(
            "Unable to load Supabase signing keys. Check SUPABASE_URL."
        ) from exc
    except InvalidTokenError as exc:
        raise TokenValidationError("Invalid or expired access token.") from exc

    return payload
