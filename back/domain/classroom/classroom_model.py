from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from common import PyObjectId, CustomBaseModel

class ClassroomCreate(CustomBaseModel):
    name: str = Field(..., description="Name of the classroom.")
    description: str = Field(..., description="Description of the classroom.")
    teacher_id: PyObjectId = Field(..., description="ID of the teacher creating the classroom.")

class Classroom(CustomBaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    name: str = Field(..., description="Name of the classroom.")
    description: str = Field(..., description="Description of the classroom.")
    teacher_id: PyObjectId = Field(..., description="ID of the teacher creating the classroom.")
    students: List[PyObjectId] = Field(default_factory=list, description="List of student IDs.")
    pending_students: List[PyObjectId] = Field(default_factory=list, description="List of pending student IDs.")
