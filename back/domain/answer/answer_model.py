from pydantic import Field, field_validator
import datetime
from typing import List
from common import PyObjectId, CustomBaseModel

class AnswerCreate(CustomBaseModel):
    content: str

    @field_validator('content')
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError('Content cannot be empty')
        return v

class Answer(CustomBaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    content: str
    create_date: datetime.datetime
    question_id: PyObjectId
