import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Box, Title } from "@mantine/core";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  isDisabled?: boolean;
}

export default function CodeEditor({ value, onChange, isDisabled }: CodeEditorProps) {
  return (
    <Box>
      <Title>Code Editor</Title>
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
        options={{readOnly: isDisabled, domReadOnly: isDisabled}}
      />
    </Box>
  );
}
