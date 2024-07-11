import { Container, Flex } from "@mantine/core";
import CodeEditor from "@/components/code-editor";
import Preview from "@/components/preview";
import { useState } from "react";
import { useSocket } from "@/lib/websocket/ws";
import { useCode } from "@/lib/data-hooks/use-code";

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

  // NOTE: for now the retrieved data is fixed because db implementation isn't finished yet!
  const { data: codeData, isLoading, isError } = useCode(5);

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
      <Flex justify="center" gap="md" align="center" mt="md">
        <CodeEditor value={value} onChange={handleChangeValue} timeDuration={50} />
        <Preview value={value} />
        {codeData?.code?.userId} {codeData?.code?.challengeId}
      </Flex>
    </Container>
  );
}
