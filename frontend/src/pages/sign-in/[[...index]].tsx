import { SignIn } from "@clerk/nextjs";
import { Flex } from "@mantine/core";

export default function SignInPage() {
  return (
    <Flex justify="center" align="center" direction="column" h="85vh" gap="md">
      <SignIn />
    </Flex>
  );
}
