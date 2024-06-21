import { useState, useEffect, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

function useWebSocket(url: string): { socket: WebSocket | null, lastMessage: WebSocketMessage | null, isConnected: boolean } {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);  // 로그로 메시지 기록
      try {
        const message = JSON.parse(event.data);
        setLastMessage(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  return { socket, lastMessage, isConnected };
}

export default useWebSocket;
