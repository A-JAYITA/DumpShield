from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from pymongo.errors import PyMongoError

from .config import get_settings

settings = get_settings()
client = MongoClient(
    settings.mongodb_uri,
    serverSelectionTimeoutMS=settings.mongodb_timeout_ms,
)
db: Database = client[settings.mongodb_db_name]


def get_users_collection() -> Collection:
    return db["users"]


def ensure_indexes() -> None:
    if settings.auth_storage == "sqlite":
        return

    # Unique email lookup keeps registration fast and prevents duplicate accounts.
    try:
        get_users_collection().create_index("email", unique=True)
    except PyMongoError as exc:
        print(f"MongoDB index setup skipped: {exc}")
