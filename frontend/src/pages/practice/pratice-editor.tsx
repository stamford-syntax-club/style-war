import Editor from "@monaco-editor/react";
import { Box } from "@mantine/core";

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
      <Editor
        className="border border-gray-600 rounded p-1"
        width="100vh"
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
