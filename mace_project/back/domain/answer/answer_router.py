from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import AnswerCreate, Answer
from database import get_db
from websocket import manager
import json
import logging
from .answer_crud import create_answer, update_answer, delete_answer, prepare_broadcast_data

logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/api/answer")

@router.post("/create/{question_id}", status_code=status.HTTP_201_CREATED)
async def answer_create(question_id: str, answer_data: AnswerCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        new_answer = await create_answer(db, question_id, answer_data)
        broadcast_data = prepare_broadcast_data(new_answer, "new_answer")
        await manager.broadcast(json.dumps(broadcast_data), f'question_{question_id}')
        return Answer(**new_answer)
    except Exception as e:
        logging.error(f"Failed to create answer: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create answer")

@router.put("/update/{answer_id}", status_code=status.HTTP_200_OK)
async def answer_update(answer_id: str, answer_data: AnswerCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        updated_answer = await update_answer(db, answer_id, answer_data)
        broadcast_data = prepare_broadcast_data(updated_answer, "updated_answer")
        await manager.broadcast(json.dumps(broadcast_data), f'question_{str(updated_answer["question_id"])}')
        return Answer(**updated_answer)
    except Exception as e:
        logging.error(f"Failed to update answer: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update answer")

@router.delete("/delete/{answer_id}", status_code=status.HTTP_200_OK)
async def answer_delete(answer_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        deleted_answer_id = await delete_answer(db, answer_id)
        broadcast_data = {"type": "delete_answer", "data": {"id": str(deleted_answer_id)}}
        await manager.broadcast(json.dumps(broadcast_data), f'question_{str(deleted_answer_id)}')
        return {"detail": "Answer deleted"}
    except Exception as e:
        logging.error(f"Failed to delete answer: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete answer")
