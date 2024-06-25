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



def prepare_broadcast_data(question, event_type):
    """Prepare data for broadcasting new questions."""
    return {
        "type": event_type,
        "data": {
            "id": str(question["_id"]),
            "subject": question["subject"],
            "create_date": question["create_date"].strftime("%Y-%m-%d %H:%M:%S")
        }
    }
