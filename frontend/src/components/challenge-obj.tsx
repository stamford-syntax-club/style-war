import { Box, Title, Paper, List, Checkbox } from "@mantine/core";
import React from "react";

type value = { value: (string | null)[] };

export default function Obj({ value }: value) {
  return (
    <Box className="w-[540px] h-[735px]">
      <Title order={3}>Objectives</Title>
      <Paper className="border border-gray-600 rounded p-1 h-[100%] w-[100%]">
        {value?.map((m) => {
          return <Checkbox key={`${m}`} label={m} className="m-5" />;
        })}
      </Paper>
    </Box>
  );
}
