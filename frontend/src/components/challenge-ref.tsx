import React from "react";
import Image from "next/image";
import { Flex, Box, Title, Button, Stack } from "@mantine/core";

type type = { img: string, closeButton: () => void };


export default function Ref({ img, closeButton }: type) {
  return (
    <Box className="min-w-[40%]">
      <Flex direction="row" justify="space-between">
        <Title>Reference</Title>
        <Button onClick={closeButton}>Close</Button>
      </Flex>
      <Stack className="min-h-[80vh] border bg-neutral-900 p-1 overflow-hidden">
        <Image src={img} width={550} height={700} alt="Picture of the author" />
      </Stack>
    </Box>
  );
}
