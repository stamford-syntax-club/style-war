import React from 'react'
import { Flex, Box, Title, Paper, Button, NavLink } from "@mantine/core";
import Image from 'next/image'
type img = { img: string }
function Ref({ img }: img) {
  return (
    <>
      <Box className="min-w-[40%]">
        <Flex direction="row" justify="space-between">
          <Title>Reference</Title>
          <Button variant="filled" className="mb-1">
            <NavLink href="playground" label="Playground" />
          </Button>
        </Flex>
        <Paper className="min-h-[80vh] border bg-neutral-900 p-1 overflow-hidden">
          <Image src={img} width={550} height={700} alt="Picture of the author" />
        </Paper>
      </Box>

    </ >
  )
}
export default Ref
