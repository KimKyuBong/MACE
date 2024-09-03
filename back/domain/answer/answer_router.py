from fastapi import APIRouter, Depends, HTTPException, status
from beanie import PydanticObjectId
from .answer_service import AnswerService

router = APIRouter(prefix="/api/answer")

@router.post("/create/{question_id}", status_code=status.HTTP_201_CREATED)
async def answer_create(question_id: PydanticObjectId, content: str):
    try:
        new_answer = await AnswerService.create_answer_service(question_id, content)
        return new_answer
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create answer")

@router.put("/update/{answer_id}", status_code=status.HTTP_200_OK)
async def answer_update(answer_id: PydanticObjectId, content: str):
    try:
        updated_answer = await AnswerService.update_answer_service(answer_id, content)
        return updated_answer
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update answer")

@router.delete("/delete/{answer_id}", status_code=status.HTTP_200_OK)
async def answer_delete(answer_id: PydanticObjectId):
    try:
        result = await AnswerService.delete_answer_service(answer_id)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete answer")
