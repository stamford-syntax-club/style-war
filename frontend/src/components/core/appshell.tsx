import { AppShell, Flex, Text, Title } from "@mantine/core";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export function ApplicationShell({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Flex h="100%" gap="md" align="center" justify="center">
          <div className="relative aspect-[3.664] h-4/6">
            <Link href="/">
              <Image
                src="/assets/images/stamford-logo-clearbg-white.png"
                alt="stamford logo"
                fill
              />
            </Link>
          </div>
          <Link href="/">
            <Title order={3}>STYLE WARS</Title>
          </Link>
          <Link href="/competition">
            <Text tt="uppercase">competition</Text>
          </Link>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
