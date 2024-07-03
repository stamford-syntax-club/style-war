import { Container, Flex } from '@mantine/core'
import CodeEditor from '@/components/code-editor';
import Preview from '@/components/preview';
import { useState } from 'react';

export default function Playground() {
  const [value, setValue] = useState("<!DOCTYPE html>\n<html>\n<head>\n<style>\n</style>\n</head>\n<body>\n\n</body>\n</html>");

  const handleChangeValue = (newValue: string | undefined) => {
    setValue(newValue || "");
  };

  return (
    <Container fluid>
        <Flex justify="center" gap="md" align="center" mt="md">
            <CodeEditor value={value} onChange={handleChangeValue}/>
            <Preview value={value} />
        </Flex>
    </Container>
  );
}