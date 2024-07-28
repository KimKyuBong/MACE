from pydantic import Field, validator
from datetime import datetime
from typing import List
from common import PyObjectId, CustomBaseModel
from bson import ObjectId
from domain.answer.answer_model import Answer

class QuestionCreate(CustomBaseModel):
    subject: str
    content: str

    @validator('subject', 'content')
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v

class Question(CustomBaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    classroom_id: PyObjectId
    subject: str
    content: str
    create_date: datetime = Field(default_factory=datetime.utcnow, description="Creation date of the question.")
    answers: List[Answer] = []

    class Config:
        json_encoders = {
            ObjectId: str
        }
