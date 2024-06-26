from fastapi import FastAPI,WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware
from typing import List
from websocket import manager 
from database.db import get_db, Database
from contextlib import asynccontextmanager
import logging

app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await Database.connect()
    yield
    await Database.disconnect()

app = FastAPI(lifespan=lifespan)


# CORS 설정
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 도메인별 라우터
from domain.answer import answer_router
from domain.question import question_router
from domain.user import user_router

app.include_router(question_router.router)
app.include_router(answer_router.router)
app.include_router(user_router.router)


# 웹소켓 엔드포인트
@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            logging.info(f"Received data: {data} from room: {room_id}")
            await manager.broadcast(f"Room {room_id}: {data}", room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        logging.info(f"WebSocket disconnected from room: {room_id}")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")  # 추가: 일반 예외 처리



logging.basicConfig(level=logging.INFO)