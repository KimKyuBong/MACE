from typing import List, Union
from beanie import PydanticObjectId
from .activity_repository import ActivityRepository
from .activity_model import Activity
from fastapi import HTTPException, status
import logging

class ActivityService:

    @staticmethod
    async def handle_exception(e: Exception, message: str):
        logging.error(f"{message}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=message)

    @staticmethod
    async def create_activity_service(name: str, description: str, classroom_id: PydanticObjectId) -> Activity:
        try:
            new_activity = await ActivityRepository.create_activity(name, description, classroom_id)
            logging.info("Activity created successfully.")
            return new_activity
        except Exception as e:
            await ActivityService.handle_exception(e, "Failed to create activity")

    @staticmethod
    async def get_activities_service(classroom_id: PydanticObjectId = None) -> Union[List[Activity], str]:
        try:
            activities = await ActivityRepository.get_activities(classroom_id)
            if not activities:
                return "No activities found"
            return activities
        except Exception as e:
            await ActivityService.handle_exception(e, "Failed to get activities")

    @staticmethod
    async def delete_activity_service(activity_id: PydanticObjectId):
        try:
            deleted = await ActivityRepository.delete_activity(activity_id)
            if not deleted:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
            logging.info("Activity deleted successfully.")
            return {"detail": "Activity deleted"}
        except Exception as e:
            await ActivityService.handle_exception(e, "Failed to delete activity")
