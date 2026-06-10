import sqlite3
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from pymongo.errors import DuplicateKeyError, PyMongoError

from .config import get_settings
from .database import get_users_collection

settings = get_settings()


class DuplicateUserError(Exception):
    pass


class UserStoreUnavailableError(Exception):
    pass


def _serialize_sqlite_user(row: sqlite3.Row) -> dict:
    return {
        "_id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "password_hash": row["password_hash"],
        "created_at": datetime.fromisoformat(row["created_at"]),
    }


def _get_sqlite_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(settings.sqlite_db_path)
    connection.row_factory = sqlite3.Row
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        """
    )
    connection.commit()
    return connection


def create_user(name: str, email: str, password_hash: str) -> dict:
    now = datetime.now(timezone.utc)

    if settings.auth_storage == "sqlite":
        user_id = str(ObjectId())
        try:
            with _get_sqlite_connection() as connection:
                connection.execute(
                    """
                    INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        user_id,
                        name,
                        email,
                        password_hash,
                        now.isoformat(),
                        now.isoformat(),
                    ),
                )
            return {
                "_id": user_id,
                "name": name,
                "email": email,
                "password_hash": password_hash,
                "created_at": now,
            }
        except sqlite3.IntegrityError as exc:
            raise DuplicateUserError from exc
        except sqlite3.Error as exc:
            raise UserStoreUnavailableError from exc

    user_doc = {
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "created_at": now,
        "updated_at": now,
    }

    try:
        result = get_users_collection().insert_one(user_doc)
    except DuplicateKeyError as exc:
        raise DuplicateUserError from exc
    except PyMongoError as exc:
        raise UserStoreUnavailableError from exc

    user_doc["_id"] = result.inserted_id
    return user_doc


def find_user_by_email(email: str) -> Optional[dict]:
    if settings.auth_storage == "sqlite":
        try:
            with _get_sqlite_connection() as connection:
                row = connection.execute(
                    "SELECT * FROM users WHERE email = ?",
                    (email,),
                ).fetchone()
            return _serialize_sqlite_user(row) if row else None
        except sqlite3.Error as exc:
            raise UserStoreUnavailableError from exc

    try:
        return get_users_collection().find_one({"email": email})
    except PyMongoError as exc:
        raise UserStoreUnavailableError from exc


def find_user_by_id(user_id: str) -> Optional[dict]:
    if settings.auth_storage == "sqlite":
        try:
            with _get_sqlite_connection() as connection:
                row = connection.execute(
                    "SELECT * FROM users WHERE id = ?",
                    (user_id,),
                ).fetchone()
            return _serialize_sqlite_user(row) if row else None
        except sqlite3.Error as exc:
            raise UserStoreUnavailableError from exc

    if not ObjectId.is_valid(user_id):
        return None

    try:
        return get_users_collection().find_one({"_id": ObjectId(user_id)})
    except PyMongoError as exc:
        raise UserStoreUnavailableError from exc
