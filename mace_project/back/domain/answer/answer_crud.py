from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from models import AnswerCreate
import logging

async def create_answer(db: AsyncIOMotorDatabase, question_id: str, answer_data: AnswerCreate):
    question_id_obj = ObjectId(question_id)
    new_answer = {
        "content": answer_data.content,
        "create_date": datetime.utcnow(),
        "question_id": question_id_obj
    }
    result = await db["answers"].insert_one(new_answer)
    new_answer["_id"] = result.inserted_id
    logging.info(f"Created new answer: {new_answer}")
    return new_answer

async def update_answer(db: AsyncIOMotorDatabase, answer_id: str, answer_data: AnswerCreate):
    answer_id_obj = ObjectId(answer_id)
    updated_answer = {
        "content": answer_data.content,
        "create_date": datetime.utcnow()
    }
    await db["answers"].update_one({"_id": answer_id_obj}, {"$set": updated_answer})
    updated_answer["_id"] = answer_id_obj
    logging.info(f"Updated answer: {updated_answer}")
    return updated_answer

async def delete_answer(db: AsyncIOMotorDatabase, answer_id: str):
    answer_id_obj = ObjectId(answer_id)
    await db["answers"].delete_one({"_id": answer_id_obj})
    logging.info(f"Deleted answer with id: {answer_id_obj}")
    return answer_id_obj

def prepare_broadcast_data(answer, event_type):
    """ Prepare data for broadcasting answers. """
    return {
        "type": event_type,
        "data": {
            "id": str(answer["_id"]),
            "content": answer["content"],
            "create_date": answer["create_date"].isoformat(),
            "question_id": str(answer["question_id"])
        }
    }
