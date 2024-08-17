import { Box, Title, Paper, List, Checkbox } from "@mantine/core";
import React from "react";

type value = { value: (string | null)[] };

export default function Obj({ value }: value) {

  return (
    <Box>
      <Title>Objectives</Title>
      <Paper className="border border-gray-600 rounded p-1 h-[80vh] w-[50vw]">
        {
          value?.map((m) => {

            return (
              <Checkbox
                key={`${m}`}
                label={m}
                className="m-5"
              />)

          })
        }
      </Paper>
    </Box>
  );
}
