from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Union
from .activity_model import ActivityCreate, Activity
from .activity_crud import create_activity, get_activities, delete_activity
from database.db import get_db
from auth import get_current_user
from domain.user.user_model import User

router = APIRouter(prefix="/api/activity")

@router.post("/", response_model=Activity)
async def create_activity_endpoint(
    activity_data: ActivityCreate, 
    db: AsyncIOMotorDatabase = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can create activities")
    return await create_activity(db, activity_data)

@router.get("/", response_model=Union[List[Activity], dict])
async def get_activities_endpoint(
    classroom_id: str = None, 
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    activities = await get_activities(db, classroom_id)
    if isinstance(activities, str):
        return {"message": activities}
    return activities

@router.delete("/{activity_id}", response_model=dict)
async def delete_activity_endpoint(
    activity_id: str, 
    db: AsyncIOMotorDatabase = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can delete activities")
    await delete_activity(db, activity_id)
    return {"message": "Activity deleted"}
