# FastAPI와 SQLAlchemy에서 필요한 모듈을 임포트
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status


# 데이터베이스 세션을 가져오기 위한 함수 임포트
from database import get_db
# 질문 스키마와 CRUD 작업을 포함하는 모듈 임포트
from domain.question import question_schema, question_crud

# API 라우터 설정, '/api/question'을 기본 URL 접두어로 사용
router = APIRouter(
    prefix="/api/question",
)

# 질문 목록을 반환하는 API 엔드포인트
@router.get("/list", response_model=list[question_schema.Question])
def question_list(db : Session = Depends(get_db)):
    _question_list = question_crud.get_question_list(db)
    return _question_list

# 특정 질문의 상세 정보를 반환하는 API 엔드포인트
@router.get("/detail/{question_id}", response_model=question_schema.Question)
def question_detail(question_id: int, db : Session = Depends(get_db)):
    question = question_crud.get_question(db, question_id=question_id)
    return question

@router.post("/create", status_code=status.HTTP_204_NO_CONTENT)
def question_create(_question_create: question_schema.QuestionCreate, db : Session = Depends(get_db)):
    question_crud.create_question(db=db, question_create=_question_create)
