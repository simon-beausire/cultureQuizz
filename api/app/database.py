from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from .config import settings

# pool_pre_ping : MySQL ferme les connexions inactives, on la teste avant de la donner
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def get_session() -> Iterator[Session]:
    """Dépendance FastAPI : une session par requête, toujours fermée ensuite."""
    with SessionLocal() as session:
        yield session
