import { Button, Container, Flex } from "@mantine/core";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <Container>
      <Flex w="100%" direction="column" gap="md" align="center">
        Sign up is not allowed, please contact admin for credentials
        <Link href="/">
          <Button>Take me back</Button>
        </Link>
      </Flex>
    </Container>
  );
}
