from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from typing import List
from common import PyObjectId, CustomBaseModel

class ActivityCreate(CustomBaseModel):
    name: str = Field(..., description="Name of the activity.")
    description: str = Field(..., description="Description of the activity.")
    classroom_id: PyObjectId = Field(..., description="ID of the classroom.")

class Activity(CustomBaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    name: str = Field(..., description="Name of the activity.")
    description: str = Field(..., description="Description of the activity.")
    classroom_id: PyObjectId = Field(..., description="ID of the classroom.")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation date of the activity.")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update date of the activity.")

    class Config:
        json_encoders = {
            ObjectId: str
        }
