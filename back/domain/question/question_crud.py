from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from .question_model import QuestionCreate, Question
from datetime import datetime
from common import PyObjectId

async def create_question(db: AsyncIOMotorDatabase, classroom_id: PyObjectId, question_data: QuestionCreate) -> Question:
    new_question = question_data.dict()
    new_question["classroom_id"] = classroom_id
    new_question["create_date"] = datetime.utcnow()
    result = await db["questions"].insert_one(new_question)
    new_question["_id"] = result.inserted_id
    return Question(**new_question)

async def update_question(db: AsyncIOMotorDatabase, question_id: PyObjectId, question_data: QuestionCreate) -> Question:
    update_data = question_data.dict()
    update_data["updated_at"] = datetime.utcnow()
    result = await db["questions"].update_one(
        {"_id": question_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise Exception("Question not found")
    updated_question = await db["questions"].find_one({"_id": question_id})
    return Question(**updated_question)

async def delete_question(db: AsyncIOMotorDatabase, question_id: PyObjectId) -> Question:
    question = await db["questions"].find_one({"_id": question_id})
    if not question:
        raise Exception("Question not found")
    await db["questions"].delete_one({"_id": question_id})
    return Question(**question)

async def get_question_detail(db: AsyncIOMotorDatabase, question_id: PyObjectId) -> Question:
    question = await db["questions"].find_one({"_id": question_id})
    if not question:
        raise Exception("Question not found")
    return Question(**question)
