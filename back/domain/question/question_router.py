from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from .question_model import QuestionCreate, Question
from database.db import get_db

import logging
from typing import List
from .question_service import create_question_service, update_question_service, delete_question_service, get_question_detail_service

logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/api/question")

@router.get("/list", response_model=List[Question])
async def question_list(db: AsyncIOMotorDatabase = Depends(get_db)):
    questions = await db["questions"].find().to_list(100)
    return [Question(**question) for question in questions]

@router.get("/detail/{question_id}", response_model=Question)
async def question_detail(question_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        question = await get_question_detail_service(db, question_id)
        return question
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def question_create(question_data: QuestionCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        new_question = await create_question_service(db, question_data)
        return new_question
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/update/{question_id}", response_model=Question)
async def question_update(question_id: str, question_data: QuestionCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        updated_question = await update_question_service(db, question_id, question_data)
        return updated_question
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete/{question_id}", status_code=status.HTTP_200_OK)
async def question_delete(question_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        result = await delete_question_service(db, question_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
