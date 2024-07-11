import { SignIn } from "@clerk/nextjs";
import { Flex } from "@mantine/core";

export default function SignInPage() {
  return (
    <Flex justify="center" align="center" h="90vh">
      <SignIn />
    </Flex>
  );
}
