import { useSession } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";

export function useSocket(room: string = "competition") {
  const { session } = useSession();
  const [token, setToken] = useState("");

  useEffect(() => {
    session
      ?.getToken({ template: "style-wars" })
      .then((token) => setToken(token || ""));
  }, [session]);

  return useMemo(
    () => new WebSocket(`ws://localhost:8080/ws/${room}/?token=${token}`),
    [token],
  );
}
