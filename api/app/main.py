import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from .config import settings
from .database import SessionLocal, engine
from .models import Base
from .routers import categories
from .seed import seed

logger = logging.getLogger("uvicorn")


def wait_for_database(attempts: int = 30, delay: float = 2.0) -> None:
    """Docker already waits for MySQL's healthcheck, but MySQL can still refuse
    the very first connections while it finishes booting."""
    for attempt in range(1, attempts + 1):
        try:
            with engine.connect():
                return
        except OperationalError:
            if attempt == attempts:
                raise
            logger.info("MySQL pas encore prêt (essai %s/%s)...", attempt, attempts)
            time.sleep(delay)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once at start-up: create the tables, then fill them if they are empty.
    # This replaces Laravel's `php artisan migrate --seed`.
    wait_for_database()
    Base.metadata.create_all(engine)

    with SessionLocal() as session:
        inserted = seed(session)

    if inserted:
        logger.info("Base initialisée : %s questions insérées.", inserted)
    else:
        logger.info("Base déjà remplie, rien à insérer.")

    yield


app = FastAPI(
    title="Culture Quizz API",
    description="API du quiz de culture générale.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(categories.router)


@app.get("/api/health", tags=["health"], summary="Vérifier que l'API répond")
def health():
    return {"status": "ok"}
