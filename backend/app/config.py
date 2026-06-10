import os
from functools import lru_cache
from typing import List


class Settings:
    mongodb_uri: str
    mongodb_db_name: str
    mongodb_timeout_ms: int
    auth_storage: str
    sqlite_db_path: str
    jwt_secret_key: str
    jwt_algorithm: str
    jwt_expires_minutes: int
    cors_origins: List[str]

    def __init__(self) -> None:
        self.mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        self.mongodb_db_name = os.getenv("MONGODB_DB_NAME", "dumpshield")
        self.mongodb_timeout_ms = int(os.getenv("MONGODB_TIMEOUT_MS", "5000"))
        self.auth_storage = os.getenv("AUTH_STORAGE", "mongodb").lower()
        self.sqlite_db_path = os.getenv("SQLITE_DB_PATH", "dumpshield_auth.db")
        self.jwt_secret_key = os.getenv("JWT_SECRET_KEY", "change-this-secret-before-deploying")
        self.jwt_algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        self.jwt_expires_minutes = int(os.getenv("JWT_EXPIRES_MINUTES", "1440"))
        self.cors_origins = [
            origin.strip()
            for origin in os.getenv("CORS_ORIGINS", "*").split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
