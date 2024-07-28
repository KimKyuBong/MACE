from pydantic import Field, validator
from datetime import datetime
from bson import ObjectId
from typing import List
from common import PyObjectId, CustomBaseModel

class AnswerCreate(CustomBaseModel):
    content: str

    @validator('content')
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError('Content cannot be empty')
        return v

class Answer(CustomBaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    content: str
    create_date: datetime = Field(default_factory=datetime.utcnow, description="Creation date of the answer.")
    question_id: PyObjectId

    class Config:
        json_encoders = {
            ObjectId: str
        }
