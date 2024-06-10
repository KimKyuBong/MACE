from motor.motor_asyncio import AsyncIOMotorDatabase
from .question_crud import create_question, update_question, delete_question, get_question_detail, broadcast_question
from .question_model import QuestionCreate, Question
from websocket import manager
import logging
from fastapi.encoders import jsonable_encoder
import json


async def create_question_service(db: AsyncIOMotorDatabase, question_data: QuestionCreate):
    try:
        new_question = await create_question(db, question_data)
        await broadcast_question(manager, new_question, "new_question", "question")
        logging.info("Question broadcasted successfully.")
        return jsonable_encoder(new_question)
    except Exception as e:
        logging.error(f"Failed to create question: {str(e)}")
        raise Exception("Failed to create question")

async def update_question_service(db: AsyncIOMotorDatabase, question_id: str, question_data: QuestionCreate):
    try:
        updated_question = await update_question(db, question_id, question_data)
        await broadcast_question(manager, updated_question, "updated_question", "question")
        logging.info("Question updated and broadcasted successfully.")
        return jsonable_encoder(updated_question)
    except Exception as e:
        logging.error(f"Failed to update question: {str(e)}")
        raise Exception("Failed to update question")

async def delete_question_service(db: AsyncIOMotorDatabase, question_id: str):
    try:
        deleted_question_id = await delete_question(db, question_id)
        broadcast_data = {"type": "delete_question", "data": {"id": str(deleted_question_id)}}
        await manager.broadcast(json.dumps(broadcast_data, default=str), "question")
        logging.info("Delete event for question broadcasted successfully.")
        return {"message": "Question deleted successfully"}
    except Exception as e:
        logging.error(f"Failed to delete question: {str(e)}")
        raise Exception("Failed to delete question")

async def get_question_detail_service(db: AsyncIOMotorDatabase, question_id: str):
    question = await get_question_detail(db, question_id)
    if not question:
        raise Exception("Question not found")
    return question
