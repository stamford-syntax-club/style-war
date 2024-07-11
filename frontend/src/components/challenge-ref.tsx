import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flex, Box, Title, Button, Stack } from "@mantine/core";

type img = { img: string };


export default function Ref({ img }: img) {
  return (
    <Box className="min-w-[40%]">
      <Flex direction="row" justify="space-between">
        <Title>Reference</Title>
        <Link href="/playground">
          <Button variant="light">View Playground</Button>
        </Link>
      </Flex>
      <Stack className="min-h-[80vh] border bg-neutral-900 p-1 overflow-hidden">
        <Image src={img} width={550} height={700} alt="Picture of the author" />
      </Stack>
    </Box>
  );
}
