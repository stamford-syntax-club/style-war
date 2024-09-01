import React from "react";
import Image from "next/image";
import { Flex, Box, Title, Stack } from "@mantine/core";

type type = { img: string };

export default function Ref({ img }: type) {
  return (
    <Box className="w-[540px] h-[735px]">
      <Flex direction="row" justify="space-between">
        <Title order={3}>Reference</Title>
      </Flex>
      <Stack className="border bg-neutral-900 p-1 overflow-hidden w-[100%] h-[100%] relative">
        <Image
          src={img}
          sizes="100vw"
          alt="Picture of the author"
          width={540}
          height={735}
          objectFit="cover"
          quality={100}
        />
      </Stack>
    </Box>
  );
}
