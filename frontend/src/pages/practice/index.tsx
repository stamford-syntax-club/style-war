import { Container, Flex, Modal, Text, Title } from "@mantine/core";
import CodeEditor from "./pratice-editor";
import Preview from "./parctice-preview";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export default function PracticePlayground() {
  const [opened, {open, close}] = useDisclosure(true);
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
      <Modal title="Practice Playground" opened={opened} onClose={close} centered>
        <Text>
            This is a practice playground where you get familiar with the platform before the compition. Blah Blah Blah 
        </Text>
      </Modal>
      <Flex justify="center" gap="md" align="center" mt="md">
        <CodeEditor
          value={value}
          onChange={handleChangeValue}
          timeDuration={10}
        />
        <Preview value={value} />
      </Flex>
    </Container>
  );
}
