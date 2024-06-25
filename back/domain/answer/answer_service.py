from motor.motor_asyncio import AsyncIOMotorDatabase
from .answer_crud import create_answer, update_answer, delete_answer
from .answer_model import AnswerCreate, Answer
from websocket import *
import logging
import json
from fastapi.encoders import jsonable_encoder

async def create_answer_service(db: AsyncIOMotorDatabase, question_id: str, answer_data: AnswerCreate):
    try:
        new_answer = await create_answer(db, question_id, answer_data)
        broadcast_data = prepare_broadcast_data(new_answer, "new_answer")
        await manager.broadcast(json.dumps(broadcast_data), f'question_{question_id}')
        logging.info("Answer created and broadcasted successfully.")
        return jsonable_encoder(broadcast_data)
    except Exception as e:
        logging.error(f"Failed to create answer: {str(e)}")
        raise Exception("Failed to create answer")

async def update_answer_service(db: AsyncIOMotorDatabase, answer_id: str, answer_data: AnswerCreate):
    try:
        updated_answer = await update_answer(db, answer_id, answer_data)
        broadcast_data = prepare_broadcast_data(updated_answer, "updated_answer")
        await manager.broadcast(json.dumps(broadcast_data), f'question_{str(updated_answer["question_id"])}')
        logging.info("Answer updated and broadcasted successfully.")
        return jsonable_encoder(broadcast_data)
    except Exception as e:
        logging.error(f"Failed to update answer: {str(e)}")
        raise Exception("Failed to update answer")

async def delete_answer_service(db: AsyncIOMotorDatabase, answer_id: str):
    try:
        deleted_answer_id = await delete_answer(db, answer_id)
        broadcast_data = {"type": "delete_answer", "data": {"id": str(deleted_answer_id)}}
        await manager.broadcast(json.dumps(broadcast_data), f'question_{str(deleted_answer_id)}')
        logging.info("Answer deleted and broadcasted successfully.")
        return {"detail": "Answer deleted"}
    except Exception as e:
        logging.error(f"Failed to delete answer: {str(e)}")
        raise Exception("Failed to delete answer")
