import { Box, Title, Paper } from "@mantine/core";
import React from "react";

type value = { value: string };
function Obj({ value }: value) {
  return (
    <>
      <Box>
        <Title>Objectives</Title>
        <Paper className="border border-gray-600 rounded p-1 h-[80vh] w-[50vw]">
          {value}
        </Paper>
      </Box>
    </>
  );
}

export default Obj;
