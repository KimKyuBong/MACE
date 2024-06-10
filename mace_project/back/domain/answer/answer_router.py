from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from models import AnswerCreate, Answer
from database import get_db
from websocket import manager
import json
import logging
from .answer_crud import create_answer, update_answer, delete_answer
from fastapi.encoders import jsonable_encoder

logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/api/answer")

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

@router.post("/create/{question_id}", status_code=status.HTTP_201_CREATED)
async def answer_create(question_id: str, answer_data: AnswerCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    new_answer = await create_answer(db, question_id, answer_data)
    if not new_answer:
        raise HTTPException(status_code=500, detail="Failed to create answer")
    logging.info(f"Answer created: {new_answer}")

    broadcast_data = prepare_broadcast_data(new_answer, "new_answer")
    await manager.broadcast(json.dumps(broadcast_data), f'question_{question_id}')

    # Check if the answer is in the database
    answer_in_db = await db["answers"].find_one({"_id": new_answer["_id"]})
    if not answer_in_db:
        logging.error(f"Answer not found in DB after creation: {new_answer}")
        raise HTTPException(status_code=500, detail="Answer not found in DB after creation")

    return Answer(**new_answer)

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
