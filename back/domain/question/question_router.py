from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from .question_service import create_question_service, update_question_service, delete_question_service, get_question_detail_service
from .question_model import QuestionCreate, Question
from database.db import get_db
from domain.user.user_model import User
from auth import get_current_user
from common import PyObjectId

router = APIRouter(prefix="/api/classroom")

@router.post("/{classroom_id}/question", response_model=Question)
async def create_question_endpoint(classroom_id: str, question_data: QuestionCreate, db: AsyncIOMotorDatabase = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        return await create_question_service(db, classroom_id, question_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/question/{question_id}", response_model=Question)
async def update_question_endpoint(question_id: str, question_data: QuestionCreate, db: AsyncIOMotorDatabase = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        return await update_question_service(db, question_id, question_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/question/{question_id}", response_model=dict)
async def delete_question_endpoint(question_id: str, db: AsyncIOMotorDatabase = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        return await delete_question_service(db, question_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/question/{question_id}", response_model=Question)
async def get_question_detail_endpoint(question_id: str, db: AsyncIOMotorDatabase = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        return await get_question_detail_service(db, question_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
