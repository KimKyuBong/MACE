from fastapi import APIRouter, Depends, HTTPException, status, Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from .user_service import register_user_service, login_user_service
from .user_model import UserCreate, UserLogin, User
from database.db import get_db

router = APIRouter(prefix="/api/user")

@router.post("/register", response_model=User)
async def register_user(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        result = await register_user_service(db, user_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=User)
async def login_user(user_data: UserLogin, response: Response, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        result = await login_user_service(db, user_data.username, user_data.password)
        # Set cookie
        response.set_cookie(
            key="user_token",
            value=result.token,  # assuming the token is part of the User model
            httponly=True,
            secure=True,  # Set to True in production
            samesite="Strict"
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
