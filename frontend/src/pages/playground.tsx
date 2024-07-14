import { Container, Flex } from "@mantine/core";
import CodeEditor from "@/components/code-editor";
import Preview from "@/components/preview";
import { useEffect, useState } from "react";
import { useSocket } from "@/lib/websocket/ws";
import { useCode } from "@/lib/data-hooks/use-code";

interface message {
  event: string;
  remainingTime: number;
}

export default function Playground() {
  // NOTE: for now the retrieved data is fixed because db implementation isn't finished yet!
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

  const socket = useSocket();

  useEffect(() => {
    if (socket?.readyState !== 1) return;

    socket.onmessage = function (ev) {
      if (!ev.data) {
        return;
      }

      try {
        const msg = JSON.parse(ev.data) as message;
        console.log(msg);
        setRemainingTime(msg.remainingTime);
      } catch (error) {
        console.warn("Failed to parse message:", error, "Data:", ev.data);
      }
    };
  }, [socket?.readyState]);

  const handleChangeValue = (newValue: string | undefined) => {
    if (!newValue) {
      return;
    }

    socket?.send(
      JSON.stringify({
        event: "code:edit",
        code: {
          code: newValue,
          challengeId: 1, //TODO: get from backend
        },
      }),
    );
    setValue(newValue);
  };

  return (
    <Container fluid>
      {remainingTime !== null ? remainingTime : "Loading..."}
      <Flex justify="center" gap="md" align="center" mt="md">
        <CodeEditor value={value} onChange={handleChangeValue} />
        <Preview value={value} />
      </Flex>
    </Container>
  );
}
