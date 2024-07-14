from motor.motor_asyncio import AsyncIOMotorDatabase
from .classroom_model import ClassCreate
from bson import ObjectId
import logging

async def create_class(db: AsyncIOMotorDatabase, class_data: ClassCreate):
    new_class = class_data.dict()
    new_class["students"] = []
    result = await db["classes"].insert_one(new_class)
    new_class["_id"] = result.inserted_id
    logging.info(f"Created new class: {new_class}")
    return new_class

async def get_classes(db: AsyncIOMotorDatabase):
    classes = await db["classes"].find().to_list(length=100)
    return classes

async def join_class(db: AsyncIOMotorDatabase, class_id: str, user_id: str):
    result = await db["classes"].update_one({"_id": ObjectId(class_id)}, {"$addToSet": {"students": user_id}})
    if result.matched_count == 0:
        logging.error(f"Class {class_id} not found")
        return None
    logging.info(f"User {user_id} joined class {class_id}")
    return result
