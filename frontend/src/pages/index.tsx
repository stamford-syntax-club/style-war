import { Button, Container, Flex } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <Flex justify="center" align="center" gap="md">
        <Link href="/practice">
          <Button variant="default">Practice Offline</Button>
        </Link>
        <Link href="/competition">
          <Button>Enter Competition</Button>
        </Link>
      </Flex>
    </Container>
  );
}
