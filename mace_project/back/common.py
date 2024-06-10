import pytz
from pydantic import BaseModel, Field, validator
from bson import ObjectId
import datetime

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

class CustomBaseModel(BaseModel):
    class Config:
        json_encoders = {
            ObjectId: str,
            datetime.datetime: lambda dt: dt.astimezone(KST).isoformat()
        }
