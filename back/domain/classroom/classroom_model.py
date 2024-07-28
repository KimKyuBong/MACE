from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from common import PyObjectId, CustomBaseModel

class ClassroomCreate(CustomBaseModel):
    # 새 교실을 생성할 때 필요한 데이터 모델
    name: str = Field(..., description="교실의 이름")
    description: str = Field(..., description="교실에 대한 설명")

class Classroom(CustomBaseModel):
    # 교실 정보를 나타내는 데이터 모델
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    # 교실의 이름
    name: str = Field(..., description="교실의 이름")
    # 교실에 대한 설명
    description: str = Field(..., description="교실에 대한 설명")
    # 교실을 생성한 교사의 ID
    teacher_id: PyObjectId = Field(..., description="교실을 생성한 교사의 ID")
    # 교실에 속한 학생들의 ID 리스트
    students: List[PyObjectId] = Field(default_factory=list, description="학생들의 ID 리스트")
    # 가입이 승인 대기 중인 학생들의 ID 리스트
    pending_students: List[PyObjectId] = Field(default_factory=list, description="승인 대기 중인 학생들의 ID 리스트")
    # 교실에 있는 활동들의 ID 리스트
    activities: List[PyObjectId] = Field(default_factory=list, description="활동들의 ID 리스트")
    # 교실이 생성된 날짜
    created_at: datetime = Field(default_factory=datetime.utcnow, description="교실이 생성된 날짜")
    # 교실이 마지막으로 수정된 날짜
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="교실이 마지막으로 수정된 날짜")

    class Config:
        json_encoders = {
            ObjectId: str
        }

class ClassroomDetail(Classroom):
    # 교실의 세부 정보를 나타내는 모델
    activities: List[str] = Field(default_factory=list, description="활동들의 이름 리스트")
    teacher_name: Optional[str] = Field(None, description="교실을 생성한 교사의 이름")
