from beanie import Document
from bson import ObjectId
from .question_model import Question
from datetime import datetime
from fastapi import HTTPException, status

class QuestionRepository:

    @staticmethod
    async def create_question(classroom_id: ObjectId, subject: str, content: str) -> Question:
        new_question = Question(
            classroom_id=classroom_id,
            subject=subject,
            content=content,
            create_date=datetime.utcnow(),
            answers=[]
        )
        await new_question.insert()
        return new_question

    @staticmethod
    async def update_question(question_id: ObjectId, subject: str, content: str) -> Question:
        question = await Question.get(question_id)
        if not question:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

        question.subject = subject
        question.content = content
        question.updated_at = datetime.utcnow()

        await question.save()
        return question

    @staticmethod
    async def delete_question(question_id: ObjectId) -> bool:
        question = await Question.get(question_id)
        if not question:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

        await question.delete()
        return True

    @staticmethod
    async def get_question_detail(question_id: ObjectId) -> Question:
        question = await Question.get(question_id)
        if not question:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

        return question
