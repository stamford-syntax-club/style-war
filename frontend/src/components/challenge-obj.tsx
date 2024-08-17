import { Box, Title, Paper, List } from "@mantine/core";
import React from "react";

type value = { value: (string | null)[] };

export default function Obj({ value }: value) {

  return (
    <Box>
      <Title>Objectives</Title>
      <Paper className="border border-gray-600 rounded p-1 h-[80vh] w-[50vw]">
        {
          value?.map((m) => {
            if (m === null) {
              return <List.Item key={`null`}>No objectives</List.Item>;
            }

            const M = m[0];

            if (M >= '0' && M <= '9') {
              return (
                // <List type="ordered" size="sm" className="list-decimal">
                // <List.Item key={`${m}`}>{m}</List.Item>
                // </List>
                <div>{m}</div>
              )
            } else {
              return (
                <List type="ordered" size="sm" className="list-disc m-3">
                  <List.Item key={`${m}`}>{m}</List.Item>
                </List>)
            }

          })
        }
      </Paper>
    </Box>
  );
}
