import { Container, Flex } from "@mantine/core";
import CodeEditor from "@/components/code-editor";
import Preview from "@/components/preview";
import { useEffect, useState, useCallback } from "react";
import { useSocket } from "@/lib/websocket/ws";
import { useCode } from "@/lib/data-hooks/use-code";

interface Message {
  event: string;
  remainingTime: number;
}

export default function Playground() {
  const { data: codeData, isLoading, isError } = useCode(1);
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
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const socket = useSocket((message) => {
    try {
      const msg = JSON.parse(message.data) as Message;
      console.log("Received message:", msg);
      setRemainingTime(msg.remainingTime);
    } catch (error) {
      console.warn("Failed to parse message:", error, "Data:", message.data);
    }
  });

  const handleChangeValue = (newValue: string | undefined) => {
    if (!newValue) return;

    socket?.send(
      JSON.stringify({
        event: "code:edit",
        code: {
          code: newValue,
          challengeId: 1, // TODO: get from backend
        },
      }),
    );
    setValue(newValue);
  };

  return (
    <Container fluid>
      <div>{remainingTime !== null ? remainingTime : "Loading..."}</div>
      <Flex justify="center" gap="md" align="center" mt="md">
        <CodeEditor value={value} onChange={handleChangeValue} />
        <Preview value={value} />
      </Flex>
    </Container>
  );
}
