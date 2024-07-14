import { useState, useEffect, useCallback, useRef } from 'react';
import { useCookies } from 'react-cookie';

interface WebSocketMessage {
  type: string;
  data: any;
}

const DEFAULT_URL = process.env.REACT_APP_API_SERVER_URL


function useWebSocket(path: string = ''): { socket: WebSocket | null, lastMessage: WebSocketMessage | null, isConnected: boolean } {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds
  const [cookies] = useCookies(['token']);

  const url = `${DEFAULT_URL}${path}`;
  const connect = useCallback(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
      ws.send(JSON.stringify({ type: "auth", token: cookies.token }));
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

      if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.current += 1;
          connect();
        }, reconnectDelay);
      }
    };

    setSocket(ws);
  }, [url, cookies.token]);

  useEffect(() => {
    connect();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  return { socket, lastMessage, isConnected };
}

export default useWebSocket;
