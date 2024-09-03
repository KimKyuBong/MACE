from beanie import Document, PydanticObjectId
from typing import List, Optional
from datetime import datetime
from domain.user.user_model import User

class Classroom(Document):
    name: str
    description: str
    teacher_id: PydanticObjectId  # ObjectId 대신 PydanticObjectId 사용
    students: List[PydanticObjectId] = []  # ObjectId 대신 PydanticObjectId 사용
    pending_students: List[PydanticObjectId] = []  # ObjectId 대신 PydanticObjectId 사용
    activities: List[PydanticObjectId] = []  # ObjectId 대신 PydanticObjectId 사용
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Settings:
        collection = "classrooms"

class ClassroomDetail(Classroom):
    activities: List[str] = []
    teacher_name: Optional[str] = None
    student_details: Optional[List[User]] = None
    pending_student_details: Optional[List[User]] = None
