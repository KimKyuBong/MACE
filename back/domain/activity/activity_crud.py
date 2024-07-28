from motor.motor_asyncio import AsyncIOMotorDatabase
from .activity_model import ActivityCreate, Activity
from bson import ObjectId
from typing import List, Union
from fastapi import HTTPException, status

async def create_activity(db: AsyncIOMotorDatabase, activity_data: ActivityCreate) -> Activity:
    try:
        new_activity = activity_data.dict(by_alias=True)
        result = await db["activities"].insert_one(new_activity)
        new_activity["_id"] = result.inserted_id
        return Activity(**new_activity)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

async def get_activities(db: AsyncIOMotorDatabase, classroom_id: str = None) -> Union[List[Activity], str]:
    query = {}
    if classroom_id:
        query["classroom_id"] = ObjectId(classroom_id)
    
    activities = await db["activities"].find(query).to_list(1000)
    if not activities:
        return "No activities found"
    return [Activity(**a) for a in activities]

async def delete_activity(db: AsyncIOMotorDatabase, activity_id: str):
    try:
        result = await db["activities"].delete_one({"_id": ObjectId(activity_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
