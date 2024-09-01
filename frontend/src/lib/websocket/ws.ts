import { useSession } from "@clerk/nextjs";
import { notifications } from "@mantine/notifications";
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
      const backendURL = new URL(process.env.NEXT_PUBLIC_BACKEND_URL || "");
      const ws = new WebSocket(
        `${backendURL.protocol === "http:" ? "ws" : "wss"}://${
          backendURL.host
        }/ws/${room}?token=${token}`,
      );
      ws.onopen = function () {
        notifications.show({
          title: "Connection Status",
          message: "Connecting Success!",
          color: "green",
        });
        console.log("WebSocket connection open");
        socket.current = ws;
      };
      ws.onclose = function () {
        notifications.show({
          title: "Connection Status",
          message: "Connection closed, attempting to reconnect",
          color: "orange",
        });
        console.log("WebSocket connection closed, attempting to reconnect");
        setTimeout(() => {
          connect();
        }, 3000);
      };
      ws.onerror = function (error) {
        notifications.show({
          title: "Connection Status",
          message: "Could not establish connection",
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
    socket: useMemo(() => socket.current, [session, socket.current]),
  };
}
