import { Container, Flex } from "@mantine/core";
import CodeEditor from "@/components/code-editor";
import Preview from "@/components/preview";
import { useState } from "react";
import { useSocket } from "@/lib/websocket/ws";

export default function Playground() {
  const [value, setValue] = useState(
    `<!DOCTYPE html>
<html>
    <head>
        <style></style>
    </head>
    <body>
    </body>
</html>`,
  );

  const socket = useSocket();
  socket.addEventListener("open", (event) => {
    console.log("connection open: ", event);
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed:", event.code, event.reason);
  });

  const handleChangeValue = (newValue: string | undefined) => {
    if (!newValue) {
      return;
    }
    socket.send(
      JSON.stringify({
        event: "code:edit",
        content: newValue,
      }),
    );
    setValue(newValue);
  };

  return (
    <Container fluid>
      <Flex justify="center" gap="md" align="center" mt="md">
        <CodeEditor value={value} onChange={handleChangeValue} />
        <Preview value={value} />
      </Flex>
    </Container>
  );
}
