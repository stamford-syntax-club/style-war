import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Box, Title, Flex } from "@mantine/core";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  remainingTime: number | null;
}

export default function CodeEditor({
  value,
  onChange,
  remainingTime,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const isDisabled = remainingTime === 0 || remainingTime === null;
  const clerk = useClerk();

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly: isDisabled });
    }
  }, [isDisabled]);

  return (
    <Box>
      <Flex dir="row" justify="space-between" align="center">
        <Title>Code Editor</Title>
        <Title order={4} className="text-gray-400">
          {remainingTime === 0
            ? "Time's up!"
            : remainingTime !== null
            ? `Remaining Time: ${remainingTime}s`
            : "Waiting for players ..."}
        </Title>
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
        onChange={(newValue) => !isDisabled && onChange(newValue || "")}
        options={{ readOnly: isDisabled }}
      />
    </Box>
  );
}
