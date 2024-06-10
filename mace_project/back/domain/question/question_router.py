from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from models import QuestionCreate, Question
from database import get_db
from websocket import manager
import json
import logging
from typing import List
from .question_crud import create_question, update_question, delete_question, get_question_detail

logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/api/question")


def prepare_broadcast_data(question, event_type):
    """Prepare data for broadcasting new questions."""
    return {
        "type": event_type,
        "data": {
            "id": str(question["_id"]),
            "subject": question["subject"],
            "create_date": question["create_date"].strftime("%Y-%m-%d %H:%M:%S")
        }
    }


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
    new_question = await create_question(db, question_data)
    broadcast_data = prepare_broadcast_data(new_question.dict(), "new_question")
    json_data = json.dumps(broadcast_data)
    await manager.broadcast(json_data, "question")
    logging.info("Question broadcasted successfully.")
    return new_question


@router.put("/update/{question_id}", response_model=Question)
async def question_update(question_id: str, question_data: QuestionCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    updated_question = await update_question(db, question_id, question_data)
    broadcast_data = prepare_broadcast_data(updated_question.dict(), "updated_question")
    json_data = json.dumps(broadcast_data)
    await manager.broadcast(json_data, "question")
    logging.info("Question updated and broadcasted successfully.")
    return updated_question


@router.delete("/delete/{question_id}", status_code=status.HTTP_200_OK)
async def question_delete(question_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    deleted_question_id = await delete_question(db, question_id)
    broadcast_data = {"type": "delete_question", "data": {"id": deleted_question_id}}
    json_data = json.dumps(broadcast_data)
    await manager.broadcast(json_data, "question")
    logging.info("Delete event for question broadcasted successfully.")
    return {"message": "Question deleted successfully"}
