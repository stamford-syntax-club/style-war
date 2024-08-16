import { Container, Flex, Modal, Text, Title } from "@mantine/core";
import CodeEditor from "./pratice-editor";
import Preview from "./parctice-preview";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export default function PracticePlayground() {
  const [opened, {open, close}] = useDisclosure(true);
  const [value, setValue] = useState(
`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <!-- <script src="https://cdn.tailwindcss.com"></script> -->
    <style>
        // Add your custom styles here
    </style>
  </head>
  <body>
    <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script> -->
    <!-- DO NOT REMOVE this line -->
    <h1> Edit your code here </h1>
    <p> Uncomment the script tags to use bootstrap & tailwind</p>
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
