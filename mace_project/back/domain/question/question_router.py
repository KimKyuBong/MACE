from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import QuestionCreate, Question
from database import get_db
from websocket import manager
import logging
from typing import List
from fastapi.encoders import jsonable_encoder
from .question_crud import create_question, update_question, delete_question, get_question_detail, broadcast_question
import json  # json 모듈 임포트 추가

logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/api/question")


@router.get("/list", response_model=List[Question])
async def question_list(db: AsyncIOMotorDatabase = Depends(get_db)):
    questions = await db["questions"].find().to_list(100)
    return [Question(**question) for question in questions]


@router.get("/detail/{question_id}", response_model=Question)
async def question_detail(question_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    question = await get_question_detail(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def question_create(question_data: QuestionCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        new_question = await create_question(db, question_data)
        await broadcast_question(manager, new_question, "new_question", "question")
        logging.info("Question broadcasted successfully.")
        return jsonable_encoder(new_question)
    except Exception as e:
        logging.error(f"Failed to create question: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create question")


@router.put("/update/{question_id}", response_model=Question)
async def question_update(question_id: str, question_data: QuestionCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        updated_question = await update_question(db, question_id, question_data)
        await broadcast_question(manager, updated_question, "updated_question", "question")
        logging.info("Question updated and broadcasted successfully.")
        return jsonable_encoder(updated_question)
    except Exception as e:
        logging.error(f"Failed to update question: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update question")


@router.delete("/delete/{question_id}", status_code=status.HTTP_200_OK)
async def question_delete(question_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        deleted_question_id = await delete_question(db, question_id)
        broadcast_data = {"type": "delete_question", "data": {"id": str(deleted_question_id)}}
        json_data = json.dumps(broadcast_data, default=str)
        await manager.broadcast(json_data, "question")
        logging.info("Delete event for question broadcasted successfully.")
        return {"message": "Question deleted successfully"}
    except Exception as e:
        logging.error(f"Failed to delete question: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete question")
