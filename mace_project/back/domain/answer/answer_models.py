from bson import ObjectId
from models import PyObjectId
from pydantic import BaseModel, Field, field_validator
import datetime

class AnswerCreate(BaseModel):
    content: str

    @field_validator('content')
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('빈 값은 허용되지 않습니다.')
        return v

class Answer(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId)
    content: str
    create_date: datetime.datetime

    class Config:
        json_encoders = {
            ObjectId: str,
            datetime.datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
                "id": "60b8d6f8f8aeb5c4b5d5f00e",
                "content": "This is a sample answer.",
                "create_date": "2021-06-03T00:00:00Z"
            }
        }
