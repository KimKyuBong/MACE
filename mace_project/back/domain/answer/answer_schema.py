import datetime
from pydantic import BaseModel, field_validator

class AnswerCreate(BaseModel):
    content: str

    @field_validator('content')
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('빈 값 은 허 용 되 지 않 습 니 다.')
        return v
    
class Answer(BaseModel):
    id: int
    content: str
    create_date: datetime.datetime