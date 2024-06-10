import bcrypt
from motor.motor_asyncio import AsyncIOMotorDatabase
from .user_model import UserCreate, User
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

async def create_user(db: AsyncIOMotorDatabase, user_data: UserCreate):
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    new_user = user_data.dict()
    new_user["password"] = hashed_password
    result = await db["users"].insert_one(new_user)
    new_user["_id"] = result.inserted_id
    return new_user

async def authenticate_user(db: AsyncIOMotorDatabase, username: str, password: str):
    user = await db["users"].find_one({"username": username})
    if user and bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        return user
    return None

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
