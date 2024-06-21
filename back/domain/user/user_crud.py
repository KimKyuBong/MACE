import bcrypt
from motor.motor_asyncio import AsyncIOMotorDatabase
from .user_model import UserCreate
from bson import ObjectId
import logging

async def create_user(db: AsyncIOMotorDatabase, user_data: UserCreate):
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    new_user = user_data.dict()
    new_user["password"] = hashed_password
    result = await db["users"].insert_one(new_user)
    new_user["_id"] = result.inserted_id
    logging.info(f"Created new user: {new_user}")
    return new_user

async def authenticate_user(db: AsyncIOMotorDatabase, username: str, password: str):
    user = await db["users"].find_one({"username": username})
    if user and bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        logging.info(f"Authenticated user: {username}")
        return user
    logging.error(f"Failed to authenticate user: {username}")
    return None
