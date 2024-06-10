from pydantic import Field, field_validator
from bson import ObjectId
from common import PyObjectId, CustomBaseModel

class UserCreate(CustomBaseModel):
    username: str
    password: str
    school: str
    student_id: str
    name: str

    @field_validator('username', 'password', 'school', 'student_id', 'name')
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v

class UserLogin(CustomBaseModel):
    username: str
    password: str

class User(CustomBaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    username: str
    school: str
    student_id: str
    name: str
