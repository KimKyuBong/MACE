from fastapi import FastAPI,WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware
from typing import List
from websocket import manager 
from database import Database

app = FastAPI()

# CORS 설정
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await Database.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    await Database.disconnect()

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
            await manager.broadcast(f"Room {room_id}: {data}", room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
    except Exception as e:
        print(f"Unexpected error: {e}")  # 추가: 일반 예외 처리
        # 웹소켓 연결 종료 시 필요한 추가 작업 수행
