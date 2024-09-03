from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from utils.router_loader import load_routers
from config.settings import settings

# 모든 Beanie 모델을 여기서 임포트합니다
from domain.user.user_model import User  # 예시 모델
from domain.classroom.classroom_model import Classroom
from domain.activity.activity_model import Activity  
from domain.question.question_model import Question  
from domain.answer.answer_model import Answer  
# 다른 모델들도 여기에 추가...
import logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Starting database connection and Beanie initialization")
    try:
        # MongoDB 클라이언트 생성
        client = AsyncIOMotorClient(settings.db_url)
        
        # Beanie 초기화
        await init_beanie(
            database=client[settings.db_name],
            document_models=[User, Classroom, Activity, Question, Answer]
        )
        logging.info("Beanie initialization completed successfully")
        
        # 간단한 쿼리로 초기화 확인
        user_count = await User.count()
        logging.info(f"User collection initialized. Current user count: {user_count}")
        
    except Exception as e:
        logging.error(f"Error during database connection or Beanie initialization: {str(e)}")
        raise e
    
    yield
    
    # 연결 종료
    client.close()
    logging.info("Database connection closed")

app = FastAPI(lifespan=lifespan)

# CORS 설정
origins = ["https://mace.kbnet.kr"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 자동 로드
load_routers(app, "domain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)