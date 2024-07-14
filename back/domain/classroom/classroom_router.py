from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from .classroom_service import create_classroom, get_classrooms, request_join_classroom, approve_join_classroom
from .classroom_model import ClassroomCreate, Classroom
from database.db import get_db
from typing import List, Union

router = APIRouter()

@router.post("/create", response_model=Classroom)
async def create_classroom_endpoint(classroom_data: ClassroomCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await create_classroom(db, classroom_data)

@router.get("/", response_model=Union[List[Classroom], dict])
async def get_classrooms_endpoint(db: AsyncIOMotorDatabase = Depends(get_db)):
    classrooms = await get_classrooms(db)
    if isinstance(classrooms, str):
        return {"message": classrooms}
    return classrooms

@router.post("/request_join/{classroom_id}", response_model=dict)
async def request_join_classroom_endpoint(classroom_id: str, student_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    await request_join_classroom(db, classroom_id, student_id)
    return {"message": "Join request sent"}

@router.post("/approve_join/{classroom_id}", response_model=dict)
async def approve_join_classroom_endpoint(classroom_id: str, student_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    await approve_join_classroom(db, classroom_id, student_id)
    return {"message": "Join request approved"}
