import { Box, Title, Paper, List } from "@mantine/core";
import React from "react";

type value = { value: (string | null)[] };

export default function Obj({ value }: value) {
  {
    value?.map((m) => {
      return <List.Item key={`${m}`}>{m}</List.Item>;
    });
  }

  return (
    <Box>
      <Title>Objectives</Title>
      <Paper className="border border-gray-600 rounded p-1 h-[80vh] w-[50vw]">
        <List type="ordered" size="sm" className="list-disc">
          <List.Item>hello</List.Item>
        </List>
      </Paper>
    </Box>
  );
}
