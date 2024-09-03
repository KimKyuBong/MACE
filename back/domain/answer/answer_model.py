from beanie import Document, PydanticObjectId
from datetime import datetime

class Answer(Document):
    content: str
    create_date: datetime
    question_id: PydanticObjectId  # PydanticObjectId로 변경

    class Settings:
        collection = "answers"
