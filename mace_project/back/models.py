import pytz
from pydantic import BaseModel, Field, validator
import datetime
from bson import ObjectId
from typing import List

KST = pytz.timezone('Asia/Seoul')

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, field):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

class AnswerCreate(BaseModel):
    content: str

    @validator('content')
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError('Content cannot be empty')
        return v

class Answer(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    content: str
    create_date: datetime.datetime
    question_id: PyObjectId

    class Config:
        json_encoders = {
            ObjectId: str,
            datetime.datetime: lambda dt: dt.astimezone(KST).isoformat()
        }

class QuestionCreate(BaseModel):
    subject: str
    content: str

    @validator('subject', 'content')
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v

class Question(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    subject: str
    content: str
    create_date: datetime.datetime
    answers: List[Answer] = []

    class Config:
        json_encoders = {
            ObjectId: str,
            datetime.datetime: lambda dt: dt.astimezone(KST).isoformat()
        }

class UserCreate(BaseModel):
    username: str
    password: str
    school: str
    student_id: str
    name: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    username: str
    school: str
    student_id: str
    name: str

    class Config:
        json_encoders = {
            ObjectId: str,
        }
