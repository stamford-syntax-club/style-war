import { useSession } from "@clerk/nextjs";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";

export function useSocket(
  onMessage: (ev: MessageEvent<any>) => void,
  room: string = "competition",
) {
  const { session } = useSession();
  const [token, setToken] = useState("");
  const socket: MutableRefObject<WebSocket | null> = useRef(null);

  useEffect(() => {
    session
      ?.getToken({ template: "style-wars" })
      .then((token) => setToken(token || ""));
  }, [session]);

  useEffect(() => {
    if (!token) return;

    const connect = () => {
      const ws = new WebSocket(`ws://localhost:8080/ws/${room}?token=${token}`);
      ws.onopen = function () {
        console.log("WebSocket connection open");
        socket.current = ws;
      };
      ws.onclose = function () {
        console.log("WebSocket connection closed, attempting to reconnect");
        setTimeout(() => {
          connect();
        }, 3000);
      };
      ws.onerror = function (error) {
        console.error("WebSocket error:", error);
      };
      ws.onmessage = function (message) {
        onMessage(message);
        console.log("WebSocket message received:", message);
      };
    };

    connect();

    return () => {
      socket.current?.close();
    };
  }, [token]);

  return useMemo(() => socket.current, [token, socket.current]);
}
