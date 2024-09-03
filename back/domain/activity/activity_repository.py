import logging
from beanie import PydanticObjectId
from .activity_model import Activity
from typing import List
from datetime import datetime

class ActivityRepository:

    @staticmethod
    async def create_activity(name: str, description: str, classroom_id: PydanticObjectId) -> Activity:
        try:
            new_activity = Activity(
                name=name,
                description=description,
                classroom_id=classroom_id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            await new_activity.insert()
            logging.info(f"Created new activity: {new_activity.dict(by_alias=True)}")
            return new_activity
        except Exception as e:
            logging.error(f"Error creating activity: {str(e)}")
            raise

    @staticmethod
    async def get_activities(classroom_id: PydanticObjectId = None) -> List[Activity]:
        try:
            if classroom_id:
                activities = await Activity.find(Activity.classroom_id == classroom_id).to_list()
            else:
                activities = await Activity.find_all().to_list()
            return activities
        except Exception as e:
            logging.error(f"Error retrieving activities: {str(e)}")
            raise

    @staticmethod
    async def delete_activity(activity_id: PydanticObjectId) -> bool:
        try:
            result = await Activity.delete(activity_id)
            success = result.deleted_count > 0
            if success:
                logging.info(f"Deleted activity with id: {activity_id}")
            else:
                logging.warning(f"Activity with id {activity_id} not found")
            return success
        except Exception as e:
            logging.error(f"Error deleting activity: {str(e)}")
            raise
