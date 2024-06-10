from pydantic import Field
from bson import ObjectId
from common import PyObjectId, CustomBaseModel

class UserCreate(CustomBaseModel):
    username: str
    password: str
    school: str
    student_id: str
    name: str

class UserLogin(CustomBaseModel):
    username: str
    password: str

class User(CustomBaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    username: str
    school: str
    student_id: str
    name: str
