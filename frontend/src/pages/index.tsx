import { Button, Container, Flex } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <Flex justify="center" align="center">
        <Link href="/playground">
          <Button>Start Coding!</Button>
        </Link>
      </Flex>
    </Container>
  );
}
