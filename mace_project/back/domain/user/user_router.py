from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from .user_crud import create_user, authenticate_user, create_access_token
from .user_model import UserCreate, UserLogin
from datetime import timedelta
from database import get_db

router = APIRouter(
    prefix="/api/user"
)

ACCESS_TOKEN_EXPIRE_MINUTES = 30

@router.post("/register", response_model=dict)
async def register_user(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await create_user(db, user_data)
    return {"msg": "User created successfully"}

@router.post("/login", response_model=dict)
async def login_user(user_data: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await authenticate_user(db, user_data.username, user_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}
