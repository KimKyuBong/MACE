from beanie import Document, PydanticObjectId
from datetime import datetime

class Question(Document):
    classroom_id: PydanticObjectId  # PydanticObjectId로 변경
    subject: str
    content: str
    create_date: datetime = datetime.utcnow()
    answers: list = []

    class Settings:
        collection = "questions"
