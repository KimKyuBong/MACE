from motor.motor_asyncio import AsyncIOMotorDatabase
from .classroom_model import ClassroomCreate, Classroom
from bson import ObjectId
from typing import List, Union
from fastapi import HTTPException, status

async def create_classroom(db: AsyncIOMotorDatabase, classroom_data: ClassroomCreate, teacher_id: ObjectId) -> Classroom:
    try:
        new_classroom = classroom_data.dict(by_alias=True)
        new_classroom["teacher_id"] = teacher_id  # teacher_id 추가
        result = await db["classrooms"].insert_one(new_classroom)
        new_classroom["_id"] = result.inserted_id
        return Classroom(**new_classroom)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

async def get_classrooms(db: AsyncIOMotorDatabase) -> Union[List[Classroom], str]:
    classrooms = await db["classrooms"].find().to_list(1000)
    if not classrooms:
        return "No classrooms found"
    return [Classroom(**c) for c in classrooms]

async def request_join_classroom(db: AsyncIOMotorDatabase, classroom_id: str, student_id: str):
    await db["classrooms"].update_one(
        {"_id": ObjectId(classroom_id)}, 
        {"$addToSet": {"pending_students": ObjectId(student_id)}}
    )

async def approve_join_classroom(db: AsyncIOMotorDatabase, classroom_id: str, student_id: str):
    await db["classrooms"].update_one(
        {"_id": ObjectId(classroom_id)}, 
        {"$pull": {"pending_students": ObjectId(student_id)}, "$addToSet": {"students": ObjectId(student_id)}}
    )
