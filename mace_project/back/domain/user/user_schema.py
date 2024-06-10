from pydantic import BaseModel, Field, EmailStr, validator
from bson import ObjectId
from typing import List

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

class UserCreate(BaseModel):
    username: str
    password: str
    school: str
    student_id: str
    name: str

    @validator('username', 'password', 'school', 'student_id', 'name')
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v

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
