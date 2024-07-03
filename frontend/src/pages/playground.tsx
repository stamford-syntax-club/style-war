import { Container, Flex } from '@mantine/core'
import CodeEditor from '@/components/code-editor';
import Preview from '@/components/preview';

export default function EditorGround() {
  return (
    <Container fluid>
        <Flex justify="center" gap="md" align="center" mt="md">
            <CodeEditor />
            <Preview />
        </Flex>
    </Container>
  );
}