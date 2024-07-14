from motor.motor_asyncio import AsyncIOMotorDatabase
from .classroom_model import ClassroomCreate, Classroom
from bson import ObjectId
from typing import List, Union

async def create_classroom(db: AsyncIOMotorDatabase, classroom_data: ClassroomCreate) -> Classroom:
    new_classroom = classroom_data.dict()
    result = await db["classrooms"].insert_one(new_classroom)
    new_classroom["_id"] = result.inserted_id
    return Classroom(**new_classroom)

async def get_classrooms(db: AsyncIOMotorDatabase) -> Union[List[Classroom], str]:
    classrooms = await db["classrooms"].find().to_list(1000)
    if not classrooms:
        return "클래스가 없습니다"
    return [Classroom(**c) for c in classrooms]

async def request_join_classroom(db: AsyncIOMotorDatabase, classroom_id: str, student_id: str):
    await db["classrooms"].update_one({"_id": ObjectId(classroom_id)}, {"$addToSet": {"pending_students": ObjectId(student_id)}})

async def approve_join_classroom(db: AsyncIOMotorDatabase, classroom_id: str, student_id: str):
    await db["classrooms"].update_one({"_id": ObjectId(classroom_id)}, {"$pull": {"pending_students": ObjectId(student_id)}, "$addToSet": {"students": ObjectId(student_id)}})
