from pydantic import Field, field_validator
from datetime import datetime
from typing import List
from bson import ObjectId
from common import PyObjectId, CustomBaseModel
from domain.answer.answer_model import Answer

class QuestionCreate(CustomBaseModel):
    subject: str
    content: str

    @field_validator('subject', 'content')
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v

class Question(CustomBaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    classroom_id: PyObjectId
    subject: str
    content: str
    create_date: datetime = Field(default_factory=datetime.utcnow)
    answers: List[Answer] = []
