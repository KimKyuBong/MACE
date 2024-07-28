from motor.motor_asyncio import AsyncIOMotorDatabase
from .classroom_model import ClassroomCreate, Classroom, ClassroomDetail
from bson import ObjectId
from typing import List, Union
from fastapi import HTTPException, status

async def create_classroom(db: AsyncIOMotorDatabase, classroom_data: ClassroomCreate, teacher_id: ObjectId) -> Classroom:
    try:
        new_classroom = classroom_data.dict(by_alias=True)
        new_classroom["teacher_id"] = teacher_id
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

async def get_classroom_details(db: AsyncIOMotorDatabase, classroom_id: str) -> Union[ClassroomDetail, None]:
    classroom = await db["classrooms"].find_one({"_id": ObjectId(classroom_id)})
    if not classroom:
        return None
    
    activities = await db["activities"].find({"classroom_id": ObjectId(classroom_id)}).to_list(1000)
    classroom["activities"] = [activity["name"] for activity in activities]  # Assuming activities have a name field
    
    teacher = await db["users"].find_one({"_id": classroom["teacher_id"]})
    classroom["teacher_name"] = teacher["name"] if teacher else "Unknown"
    
    return ClassroomDetail(**classroom)

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
