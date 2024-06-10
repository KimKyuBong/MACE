import datetime
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Answer(BaseModel):
    id: Optional[PyObjectId] = None
    content: str
    create_date: datetime.datetime

    class Config:
        json_encoders = {
            ObjectId: str,
            datetime.datetime: lambda v: v.isoformat()
        }

class Question(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId)
    subject: str
    content: str
    create_date: datetime.datetime
    answers: List[Answer] = []

    class Config:
        json_encoders = {
            ObjectId: str,
            datetime.datetime: lambda v: v.isoformat()
        }

class QuestionCreate(BaseModel):
    subject: str
    content: str

    @validator('subject', 'content')
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('must not be empty')
        return v
