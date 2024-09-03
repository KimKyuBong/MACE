from fastapi import APIRouter, Depends, HTTPException, status
from beanie import PydanticObjectId
from typing import List  # List를 import
from .activity_service import ActivityService
from .activity_model import Activity
from domain.user.user_model import User
from domain.user.user_service import UserService

router = APIRouter(prefix="/api/activity")

@router.post("/", response_model=Activity)
async def create_activity_endpoint(
    name: str, 
    description: str, 
    user: User = Depends(UserService.get_current_user)  # 사용자의 전체 정보를 가져옴
):
    user_id = user.id  # 필요한 경우 여기서 사용자 ID를 참조
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can create activities")
    return await ActivityService.create_activity_service(name, description, user_id)

@router.get("/", response_model=List[Activity])
async def get_activities_endpoint():
    try:
        activities = await ActivityService.get_activities_service()
        return activities
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch activities")

@router.delete("/{activity_id}", response_model=dict)
async def delete_activity_endpoint(
    activity_id: PydanticObjectId, 
    user: User = Depends(UserService.get_current_user)
):
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can delete activities")
    await ActivityService.delete_activity_service(activity_id)
    return {"message": "Activity deleted successfully"}
