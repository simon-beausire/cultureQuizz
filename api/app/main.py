import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from .config import settings
from .database import SessionLocal, engine
from .models import Base
from .routers import categories, reponses
from .seed import seed

logger = logging.getLogger("uvicorn")


def wait_for_database(attempts: int = 30, delay: float = 2.0) -> None:
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
    description="API du quiz technique : Python, réseau, Tailwind, cybersécurité, FastAPI.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(categories.router)
app.include_router(reponses.router)


@app.get("/api/health", tags=["health"], summary="Vérifier que l'API répond")
def health():
    return {"status": "ok"}
