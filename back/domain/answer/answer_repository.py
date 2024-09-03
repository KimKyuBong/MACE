import logging
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
from .answer_model import Answer

class AnswerRepository:
    @staticmethod
    async def create_answer(db: AsyncIOMotorDatabase, question_id: str, content: str) -> Answer:
        try:
            new_answer = Answer(
                content=content,
                create_date=datetime.utcnow(),
                question_id=ObjectId(question_id)
            )
            result = await db["answers"].insert_one(new_answer.dict(by_alias=True))
            new_answer.id = result.inserted_id
            logging.info(f"Created new answer: {new_answer.dict(by_alias=True)}")
            return new_answer
        except Exception as e:
            logging.error(f"Failed to create answer: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create answer")

    @staticmethod
    async def update_answer(db: AsyncIOMotorDatabase, answer_id: str, content: str) -> Answer:
        try:
            answer_id_obj = ObjectId(answer_id)
            update_data = {
                "content": content,
                "create_date": datetime.utcnow(),
            }
            result = await db["answers"].update_one({"_id": answer_id_obj}, {"$set": update_data})
            if result.matched_count == 0:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Answer not found")
            
            updated_answer = await db["answers"].find_one({"_id": answer_id_obj})
            logging.info(f"Updated answer: {updated_answer}")
            return Answer.from_mongo(updated_answer)
        except Exception as e:
            logging.error(f"Failed to update answer: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update answer")

    @staticmethod
    async def delete_answer(db: AsyncIOMotorDatabase, answer_id: str) -> ObjectId:
        try:
            answer_id_obj = ObjectId(answer_id)
            result = await db["answers"].delete_one({"_id": answer_id_obj})
            if result.deleted_count == 0:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Answer not found")
            
            logging.info(f"Deleted answer with id: {answer_id_obj}")
            return answer_id_obj
        except Exception as e:
            logging.error(f"Failed to delete answer: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete answer")
