# Lumina

Short-story platform with AI-generated media (planned). Monorepo: FastAPI backend + Next.js frontend, Postgres, Supabase Auth.

### How To Run Services
# Backend
    cd backend
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    alembic upgrade head
    uvicorn app.main:app --reload --port 8000

# Frontend
    cd frontend
    npm install
    npm run dev

## Prerequisites
- Python 3.11+
- Node.js 20+ (18 or 22 also fine; avoid odd versions if possible)
- Docker (for local Postgres)
- Supabase project (auth only for now)


## Environment setup
1. Supabase (local dev):
   - **Authentication → Providers → Email** — consider disabling **Confirm email** for faster iteration
   - Use the project URL and anon key in frontend env
   - Use project URL and JWT secret in backend env

## Run Postgres (Docker)

```bash
docker start lumina-postgres
# or first time:
# docker run --name lumina-postgres -e POSTGRES_USER=lumina_user \
#   -e POSTGRES_PASSWORD=strongpassword -e POSTGRES_DB=lumina_db \
#   -p 5432:5432 -d postgres:16