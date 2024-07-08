
import { Box, Title } from "@mantine/core";
import React from 'react'

type value = { value: string }
function Obj({ value }: value) {
  return (
    <>
      <Box>
        <Title>Code Editor</Title>
        <div className="border border-gray-600 rounded p-1 h-[80vh] w-[50vw]">
          {value}
        </div>
      </Box>

    </>
  )
}

export default Obj
