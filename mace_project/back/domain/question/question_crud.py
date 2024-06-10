from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from models import QuestionCreate, AnswerCreate, Question, Answer

async def create_question(db: AsyncIOMotorDatabase, question_data: QuestionCreate):
    new_question = question_data.dict()
    new_question["create_date"] = datetime.utcnow()
    result = await db["questions"].insert_one(new_question)
    new_question["_id"] = result.inserted_id
    return new_question

async def update_question(db: AsyncIOMotorDatabase, question_id: str, question_data: QuestionCreate):
    question_id_obj = ObjectId(question_id)
    updated_question = {
        "subject": question_data.subject,
        "content": question_data.content
    }
    await db["questions"].update_one({"_id": question_id_obj}, {"$set": updated_question})
    updated_question["_id"] = question_id_obj
    return updated_question

async def delete_question(db: AsyncIOMotorDatabase, question_id: str):
    question_id_obj = ObjectId(question_id)
    await db["questions"].delete_one({"_id": question_id_obj})
    return question_id_obj

async def get_question_detail(db: AsyncIOMotorDatabase, question_id: str):
    question_id_obj = ObjectId(question_id)
    question = await db["questions"].find_one({"_id": question_id_obj})
    if not question:
        return None
    answers = await db["answers"].find({"question_id": question_id_obj}).to_list(None)
    question["answers"] = answers
    return question
