# 날짜와 시간 관련 모듈 및 Pydantic의 BaseModel을 임포트
import datetime
from pydantic import BaseModel
# 답변 스키마를 포함하는 모듈 임포트
from domain.answer.answer_schema import Answer

# 질문 모델에 대한 Pydantic 스키마 정의
class Question(BaseModel):
    id: int  # 질문의 ID
    subject: str  # 질문의 제목
    content: str  # 질문의 내용
    create_date: datetime.datetime  # 질문의 생성 날짜
    answers: list[Answer] = []  # 이 질문에 대한 답변 목록
