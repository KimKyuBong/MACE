from fastapi import APIRouter, Depends, HTTPException
from .question_service import QuestionService
from .question_model import Question
from domain.user.user_model import User
from domain.user.user_service import UserService  # Import the UserService class

router = APIRouter(prefix="/api/classroom")

@router.post("/{classroom_id}/question", response_model=Question)
async def create_question_endpoint(
    classroom_id: str,
    subject: str,
    content: str,
    user: User = Depends(UserService.get_current_user)
):
    try:
        return await QuestionService.create_question(classroom_id, subject, content, user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/question/{question_id}", response_model=Question)
async def update_question_endpoint(
    question_id: str,
    subject: str,
    content: str,
    user: User = Depends(UserService.get_current_user)
):
    try:
        return await QuestionService.update_question(question_id, subject, content, user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/question/{question_id}", response_model=dict)
async def delete_question_endpoint(
    question_id: str,
    user: User = Depends(UserService.get_current_user)
):
    try:
        return await QuestionService.delete_question(question_id, user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/question/{question_id}", response_model=Question)
async def get_question_detail_endpoint(
    question_id: str,
    user: User = Depends(UserService.get_current_user)
):
    try:
        return await QuestionService.get_question_detail(question_id, user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
