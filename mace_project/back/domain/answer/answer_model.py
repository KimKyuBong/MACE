from pydantic import Field, validator
import datetime
from typing import List
from bson import ObjectId
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
    create_date: datetime.datetime
    question_id: PyObjectId
