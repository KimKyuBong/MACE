from beanie import Document, PydanticObjectId
from datetime import datetime

class Activity(Document):
    name: str
    description: str
    classroom_id: PydanticObjectId  # 변경된 부분
    created_at: datetime
    updated_at: datetime

    class Settings:
        collection = "activities"