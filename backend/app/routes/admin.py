from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from passlib.context import CryptContext
from app.config import settings
from app.utils.auth import create_access_token

router = APIRouter(prefix="/api/admin", tags=["Admin"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def admin_login(data: LoginRequest):
    print(f"Received: '{data.username}' / '{data.password}'")
    print(f"Expected: '{settings.admin_username}' / '{settings.admin_password}'")
    if data.username != settings.admin_username or data.password != settings.admin_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    token = create_access_token({"sub": data.username})
    return {"access_token": token, "token_type": "bearer"}