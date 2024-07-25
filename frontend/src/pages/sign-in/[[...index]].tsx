import { SignIn } from "@clerk/nextjs";
import { Button, Flex } from "@mantine/core";

export default function SignInPage() {
  return (
    <Flex justify="center" align="center" direction="column" h="85vh" gap="md">
      <SignIn />
      <Button variant="white" color="gray" size="md" w={200}>Practice</Button>
    </Flex>

  );
}
