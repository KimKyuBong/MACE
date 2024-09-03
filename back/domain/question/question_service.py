from .question_repository import QuestionRepository
from .question_model import Question
from websocket import manager, prepare_broadcast_data
import logging
import json
from bson import ObjectId
from fastapi import HTTPException, status

class QuestionService:

    @staticmethod
    async def handle_exception(e: Exception, message: str):
        logging.error(f"{message}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=message)

    @staticmethod
    async def create_question(classroom_id: str, subject: str, content: str) -> dict:
        try:
            classroom_object_id = ObjectId(classroom_id)
            new_question = await QuestionRepository.create_question(classroom_object_id, subject, content)
            broadcast_data = prepare_broadcast_data(new_question.dict(), "new_question")
            await manager.broadcast(json.dumps(broadcast_data), classroom_id)
            logging.info("Question broadcasted successfully.")
            return broadcast_data
        except Exception as e:
            await QuestionService.handle_exception(e, "Failed to create question")

    @staticmethod
    async def update_question(question_id: str, subject: str, content: str) -> dict:
        try:
            question_object_id = ObjectId(question_id)
            updated_question = await QuestionRepository.update_question(question_object_id, subject, content)
            broadcast_data = prepare_broadcast_data(updated_question.dict(), "updated_question")
            await manager.broadcast(json.dumps(broadcast_data), str(updated_question.classroom_id))
            logging.info("Question updated and broadcasted successfully.")
            return broadcast_data
        except Exception as e:
            await QuestionService.handle_exception(e, "Failed to update question")

    @staticmethod
    async def delete_question(question_id: str) -> dict:
        try:
            question_object_id = ObjectId(question_id)
            deleted_question = await QuestionRepository.delete_question(question_object_id)
            broadcast_data = prepare_broadcast_data(deleted_question.dict(), "deleted_question")
            await manager.broadcast(json.dumps(broadcast_data, default=str), str(deleted_question.classroom_id))
            logging.info("Delete event for question broadcasted successfully.")
            return {"message": "Question deleted successfully"}
        except Exception as e:
            await QuestionService.handle_exception(e, "Failed to delete question")

    @staticmethod
    async def get_question_detail(question_id: str) -> Question:
        try:
            question_object_id = ObjectId(question_id)
            question = await QuestionRepository.get_question_detail(question_object_id)
            return question
        except Exception as e:
            await QuestionService.handle_exception(e, "Failed to get question detail")
