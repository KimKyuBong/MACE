from motor.motor_asyncio import AsyncIOMotorDatabase
from .question_crud import create_question, update_question, delete_question, get_question_detail
from .question_model import QuestionCreate
from websocket import manager
import logging
import json
from bson import ObjectId
from common import PyObjectId

def prepare_broadcast_data(question, event_type):
    return {
        "type": event_type,
        "question": question.dict()
    }

async def create_question_service(db: AsyncIOMotorDatabase, classroom_id: str, question_data: QuestionCreate):
    try:
        classroom_object_id = PyObjectId(classroom_id)
        new_question = await create_question(db, classroom_object_id, question_data)
        broadcast_data = prepare_broadcast_data(new_question, "new_question")
        await manager.broadcast(json.dumps(broadcast_data), "question")
        logging.info("Question broadcasted successfully.")
        return broadcast_data
    except Exception as e:
        logging.error(f"Failed to create question: {str(e)}")
        raise Exception("Failed to create question")

async def update_question_service(db: AsyncIOMotorDatabase, question_id: str, question_data: QuestionCreate):
    try:
        question_object_id = PyObjectId(question_id)
        updated_question = await update_question(db, question_object_id, question_data)
        broadcast_data = prepare_broadcast_data(updated_question, "updated_question")
        await manager.broadcast(json.dumps(broadcast_data), "question")
        logging.info("Question updated and broadcasted successfully.")
        return broadcast_data
    except Exception as e:
        logging.error(f"Failed to update question: {str(e)}")
        raise Exception("Failed to update question")

async def delete_question_service(db: AsyncIOMotorDatabase, question_id: str):
    try:
        question_object_id = PyObjectId(question_id)
        deleted_question = await delete_question(db, question_object_id)
        broadcast_data = prepare_broadcast_data(deleted_question, "deleted_question")
        await manager.broadcast(json.dumps(broadcast_data, default=str), "question")
        logging.info("Delete event for question broadcasted successfully.")
        return {"message": "Question deleted successfully"}
    except Exception as e:
        logging.error(f"Failed to delete question: {str(e)}")
        raise Exception("Failed to delete question")

async def get_question_detail_service(db: AsyncIOMotorDatabase, question_id: str):
    try:
        question_object_id = PyObjectId(question_id)
        question = await get_question_detail(db, question_object_id)
        return question
    except Exception as e:
        logging.error(f"Failed to get question detail: {str(e)}")
        raise Exception("Failed to get question detail")
