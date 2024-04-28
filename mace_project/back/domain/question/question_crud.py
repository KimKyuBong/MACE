from datetime import datetime
from domain.question.question_schema import QuestionCreate
# Question 모델과 SQLAlchemy 세션 관리를 위한 임포트
from models import Question
from sqlalchemy.orm import Session

# 질문 목록을 생성 날짜 내림차순으로 검색하는 함수
def get_question_list(db: Session):
    question_list = db.query(Question)\
        .order_by(Question.create_date.desc())\
        .all()  # 쿼리를 실행하고 모든 결과를 반환
    return question_list

# 특정 ID를 가진 질문 하나를 검색하는 함수
def get_question(db: Session, question_id: int):
    question = db.get(Question, question_id)  # 주어진 기본 키(id)로 질문을 검색
    return question


def create_question(db:Session, question_create: QuestionCreate):
    db_question = Question(subject=question_create.subject,
                           content=question_create.content,
                           create_date=datetime.now())
    db.add(db_question)
    db.commit()