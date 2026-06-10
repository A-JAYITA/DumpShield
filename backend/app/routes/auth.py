from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import get_current_user, serialize_user
from ..models import AuthResponse, LoginRequest, RegisterRequest, UserResponse
from ..security import create_access_token, hash_password, verify_password
from ..user_store import (
    DuplicateUserError,
    UserStoreUnavailableError,
    create_user,
    find_user_by_email,
)

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest) -> AuthResponse:
    email = payload.email.lower()
    name = payload.name.strip()

    if payload.password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match.",
        )

    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name is required.",
        )

    try:
        user_doc = create_user(
            name=name,
            email=email,
            password_hash=hash_password(payload.password),
        )
    except DuplicateUserError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        ) from exc
    except UserStoreUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable. Please start MongoDB and try again.",
        ) from exc

    user = serialize_user(user_doc)
    token = create_access_token(subject=user.id, email=user.email)
    return AuthResponse(token=token, user=user)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest) -> AuthResponse:
    try:
        user_doc = find_user_by_email(payload.email.lower())
    except UserStoreUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable. Please start MongoDB and try again.",
        ) from exc

    if not user_doc or not verify_password(payload.password, user_doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user = serialize_user(user_doc)
    token = create_access_token(subject=user.id, email=user.email)
    return AuthResponse(token=token, user=user)


@router.get("/me", response_model=UserResponse)
def me(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    return current_user
