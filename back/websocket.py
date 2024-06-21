from fastapi import WebSocket, WebSocketDisconnect
import logging
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id in self.active_connections:
            self.active_connections[room_id].append(websocket)
        else:
            self.active_connections[room_id] = [websocket]

    def disconnect(self, websocket: WebSocket, room_id: str):
        self.active_connections[room_id].remove(websocket)

    async def broadcast(self, data: str, room_id: str):
        for connection in self.active_connections.get(room_id, []):
            await connection.send_text(data)

    # 메시지 수신 로깅을 위한 메서드 추가
    async def receive_message(self, websocket: WebSocket, room_id: str):
        try:
            while True:
                data = await websocket.receive_text()
                logging.info(f"Received message from {room_id}: {data}")  # 메시지 로깅
                # 추가적인 처리 작업이 필요할 경우 여기에 구현
        except WebSocketDisconnect:
            self.disconnect(websocket, room_id)
            logging.info(f"WebSocket disconnected from {room_id}")

manager = ConnectionManager()
