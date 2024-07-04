import { useSocket } from "@/lib/websocket/ws";
import { Container, Paper } from "@mantine/core";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [codes, setCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log(codes);
  }, [codes]);

  const socket = useSocket("admin");
  socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    console.log("recevied: ", msg);

    setCodes((prev) => ({
      ...prev,
      [msg.userId]: msg.content,
    }));
  });

  return (
    <Container>
      {Object.entries(codes).map(([userId, code]) => (
        <Paper className="w-[500px] h-[500px] border bg-neutral-900 p-1 overflow-hidden">
          {userId}
          <iframe
            title="preview"
            srcDoc={code}
            className="w-[500px] h-[500px] border-none"
          />
        </Paper>
      ))}
    </Container>
  );
}
