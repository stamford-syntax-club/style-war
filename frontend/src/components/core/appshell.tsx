import { AppShell, Button, Flex, Title } from "@mantine/core";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function ApplicationShell({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Flex w="100%" justify="space-between" p="md">
          <Link href="/">
            <Title order={3}>STYLE WARS</Title>
          </Link>
          <SignedOut>
            <Link href="/sign-in">
              <Button>Sign in</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
