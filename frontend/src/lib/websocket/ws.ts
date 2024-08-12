import { useSession } from "@clerk/nextjs";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";

export function useSocket(
  onMessage: (ev: MessageEvent<any>) => void,
  room: string = "competition"
) {
  const { session } = useSession();
  const [token, setToken] = useState("");
  const socket: MutableRefObject<WebSocket | null> = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    show: boolean;
    status: "Connecting" | "Success" | "Closed" | "Something went wrong";
    message: string;
    color: string;
  }>({
    show: true,
    status: "Connecting",
    message: "Trying to connect to webSocket!",
    color: "none",
  });

  useEffect(() => {
    session
      ?.getToken({ template: "style-wars" })
      .then((token) => setToken(token || ""));
  }, [session]);

  useEffect(() => {
    if (!token) return;

    const connect = () => {
      const backendURL = new URL(process.env.NEXT_PUBLIC_BACKEND_URL || "");
      const ws = new WebSocket(
        `wss://${backendURL.host}/ws/${room}?token=${token}`
      );
      ws.onopen = function () {
        setConnectionStatus({
          show: true,
          status: "Success",
          message: "Connected to backend ^.^",
          color: "green",
        });
        console.log("WebSocket connection open");
        socket.current = ws;
      };
      ws.onclose = function () {
        setConnectionStatus({
          show: true,
          status: "Closed",
          message: "WebSocket connection is closed!",
          color: "orange",
        });
        console.log("WebSocket connection closed, attempting to reconnect");
        setTimeout(() => {
          connect();
        }, 3000);
      };
      ws.onerror = function (error) {
        setConnectionStatus({
          show: true,
          status: "Something went wrong",
          message: "Failed to connect to backend TvT",
          color: "red",
        });
        console.error("WebSocket error:", error);
      };
      ws.onmessage = function (message) {
        onMessage(message);
        // console.log("WebSocket message received:", message);
      };
    };

    connect();

    return () => {
      socket.current?.close();
    };
  }, [token]);

  return {
    socket: useMemo(() => socket.current, [token, socket.current]),
    connectionStatus,
  };
}
