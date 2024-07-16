from pydantic import BaseModel, Field
from typing import List
from bson import ObjectId
from datetime import datetime
from common import PyObjectId, CustomBaseModel

class ClassroomCreate(CustomBaseModel):
    name: str = Field(..., description="Name of the classroom.")
    description: str = Field(..., description="Description of the classroom.")

class Classroom(CustomBaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    name: str = Field(..., description="Name of the classroom.")
    description: str = Field(..., description="Description of the classroom.")
    teacher_id: PyObjectId = Field(..., description="ID of the teacher creating the classroom.")
    students: List[PyObjectId] = Field(default_factory=list, description="List of student IDs.")
    pending_students: List[PyObjectId] = Field(default_factory=list, description="List of pending student IDs.")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation date of the classroom.")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update date of the classroom.")

    class Config:
        json_encoders = {
            ObjectId: str
        }
