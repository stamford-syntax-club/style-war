import Editor from "@monaco-editor/react";
import { Box, Title, Flex } from "@mantine/core";

interface PracticeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  timeDuration?: number;
}

export default function PracticeEditor({
  value,
  onChange,
}: PracticeEditorProps) {
  return (
    <Box>
      <Flex align="center" justify="space-between">
        <Box className="flex justify-end"></Box>
      </Flex>
      <Editor
        className="border border-gray-600 rounded p-1 "
        height="80vh"
        width="50vw"
        defaultLanguage="html"
        language="html, css"
        defaultValue=""
        theme="vs-dark"
        value={value}
        onChange={(newValue) => onChange(newValue || "")}
      />
    </Box>
  );
}
