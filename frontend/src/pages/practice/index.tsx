import { Container, Flex, Text } from "@mantine/core";
import CodeEditor from "./pratice-editor";
import Preview from "./parctice-preview";
import { useState } from "react";

interface Message {
  event: string;
  remainingTime: number;
}

export default function PracticePlayground() {
  const [value, setValue] = useState(
    `<!DOCTYPE html>
<html>
    <head>
        <style></style>
    </head>
    <body>
    </body>
</html>`
  );

  const handleChangeValue = (newValue: string | undefined) => {
    if (!newValue) {
      return;
    }
    setValue(newValue);
  };

  return (
    <Container fluid>
      <Flex justify="center" gap="md" align="center" mt="md">
        <CodeEditor
          value={value}
          onChange={handleChangeValue}
          timeDuration={300}
        />
        <Preview value={value} />
      </Flex>
    </Container>
  );
}
