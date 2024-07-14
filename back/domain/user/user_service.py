import jwt
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from .user_crud import create_user, authenticate_user
from .user_model import UserCreate, User
import logging

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def register_user_service(db: AsyncIOMotorDatabase, user_data: UserCreate):
    try:
        user = await create_user(db, user_data)
        logging.info("User created successfully.")
        return {"msg": "User created successfully"}
    except Exception as e:
        logging.error(f"Failed to create user: {str(e)}")
        raise Exception("Failed to create user")

async def login_user_service(db: AsyncIOMotorDatabase, username: str, password: str) -> User:
    try:
        user = await authenticate_user(db, username, password)
        if not user:
            raise Exception("Invalid credentials")
        
        access_token = create_access_token(data={"sub": user["username"]}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        
        user_dict = user.copy()
        user_dict["token"] = access_token
        
        return User(**user_dict)
    except Exception as e:
        logging.error(f"Failed to authenticate user: {str(e)}")
        raise Exception("Failed to authenticate user")