from fastapi import APIRouter, Depends, HTTPException, status
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
async def login_user(user_data: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        result = await login_user_service(db, user_data.username, user_data.password)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
