import logging
import json
from beanie import PydanticObjectId
from .answer_model import Answer
from websocket import manager, prepare_broadcast_data
from fastapi.encoders import jsonable_encoder
from fastapi import HTTPException, status
from datetime import datetime

class AnswerService:

    @staticmethod
    async def handle_exception(e: Exception, message: str):
        logging.error(f"{message}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=message)

    @staticmethod
    async def create_answer_service(question_id: PydanticObjectId, content: str):
        try:
            new_answer = Answer(
                content=content,
                create_date=datetime.utcnow(),
                question_id=question_id
            )
            await new_answer.insert()
            broadcast_data = prepare_broadcast_data(jsonable_encoder(new_answer), "new_answer")
            await manager.broadcast(json.dumps(broadcast_data), f'question_{question_id}')
            logging.info("Answer created and broadcasted successfully.")
            return new_answer
        except Exception as e:
            await AnswerService.handle_exception(e, "Failed to create answer")

    @staticmethod
    async def update_answer_service(answer_id: PydanticObjectId, content: str):
        try:
            answer = await Answer.get(answer_id)
            if not answer:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Answer not found")

            answer.content = content
            answer.create_date = datetime.utcnow()
            await answer.save()

            broadcast_data = prepare_broadcast_data(jsonable_encoder(answer), "updated_answer")
            await manager.broadcast(json.dumps(broadcast_data), f'question_{answer.question_id}')
            logging.info("Answer updated and broadcasted successfully.")
            return answer
        except Exception as e:
            await AnswerService.handle_exception(e, "Failed to update answer")

    @staticmethod
    async def delete_answer_service(answer_id: PydanticObjectId):
        try:
            answer = await Answer.get(answer_id)
            if not answer:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Answer not found")

            await answer.delete()
            broadcast_data = {"type": "delete_answer", "data": {"id": str(answer_id)}}
            await manager.broadcast(json.dumps(broadcast_data), f'question_{answer.question_id}')
            logging.info("Answer deleted and broadcasted successfully.")
            return {"detail": "Answer deleted"}
        except Exception as e:
            await AnswerService.handle_exception(e, "Failed to delete answer")
