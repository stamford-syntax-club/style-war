import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Box, Title } from "@mantine/core";

export default function CodeEditor() {
  const [value, setValue] = useState("");

  return (
   <Box>
    <Title>Code Editor</Title>
     <Editor
      className="border border-gray-600 rounded p-1 "
      height="80vh"
      width="50vw"
      defaultLanguage="html"
      language="html, css"
      defaultValue="// write your code here"
      theme="vs-dark"
      value={value}
    />
   </Box>
  );
}
