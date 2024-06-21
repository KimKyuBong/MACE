from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from database.db import get_db

import logging

from .answer_service import create_answer_service, update_answer_service, delete_answer_service
from .answer_model import AnswerCreate, Answer
logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/api/answer")

@router.post("/create/{question_id}", status_code=status.HTTP_201_CREATED)
async def answer_create(question_id: str, answer_data: AnswerCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        new_answer = await create_answer_service(db, question_id, answer_data)
        return new_answer
    except Exception as e:
        logging.error(f"Failed to create answer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/update/{answer_id}", status_code=status.HTTP_200_OK)
async def answer_update(answer_id: str, answer_data: AnswerCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        updated_answer = await update_answer_service(db, answer_id, answer_data)
        return updated_answer
    except Exception as e:
        logging.error(f"Failed to update answer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete/{answer_id}", status_code=status.HTTP_200_OK)
async def answer_delete(answer_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        result = await delete_answer_service(db, answer_id)
        return result
    except Exception as e:
        logging.error(f"Failed to delete answer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
