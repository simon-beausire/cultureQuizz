import secrets
from urllib.parse import quote_plus

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    db_host: str = "db"
    db_port: int = 3306
    db_database: str = "culturequizz"
    db_username: str = "quizz"
    db_password: str = "quizz"

    cors_allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    secret_key: str = Field(default_factory=lambda: secrets.token_hex(32))

    @property
    def database_url(self) -> str:
        return (
            f"mysql+pymysql://{self.db_username}:{quote_plus(self.db_password)}"
            f"@{self.db_host}:{self.db_port}/{self.db_database}?charset=utf8mb4"
        )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]


settings = Settings()
