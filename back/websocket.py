from fastapi import WebSocket, WebSocketDisconnect
from pytz import timezone
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
        logging.info(f"WebSocket connected to room {room_id}")

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
            logging.info(f"WebSocket disconnected from room {room_id}")

    async def broadcast(self, data: str, room_id: str):
        logging.info(f"Broadcasting to room {room_id}: {data}")
        for connection in self.active_connections.get(room_id, []):
            await connection.send_text(data)

    async def receive_message(self, websocket: WebSocket, room_id: str):
        try:
            while True:
                data = await websocket.receive_text()
                logging.info(f"Received message from {room_id}: {data}")
        except WebSocketDisconnect:
            self.disconnect(websocket, room_id)
            logging.info(f"WebSocket disconnected from {room_id}")


manager = ConnectionManager()


def prepare_broadcast_data(message, event_type):
    """Prepare data for broadcasting new questions."""
    # 한국 표준시 (KST) 시간대를 설정합니다.
    KST = timezone("Asia/Seoul")

    # UTC 시간을 KST 시간대로 변환합니다.
    create_date_utc = message["create_date"]
    create_date_kst = create_date_utc.astimezone(KST)

    broadcast_data = {
        "type": event_type,
        "data": {
            "_id": str(message["_id"]),
            "create_date": create_date_kst.strftime("%Y-%m-%d %H:%M:%S"),
        },
    }
    for i in ["subject", "content"]:
        if message.get(i) is not None:
            broadcast_data["data"][i] = message[i]
    logging.info(broadcast_data)
    return broadcast_data
