import "@mantine/core/styles.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { createTheme, MantineProvider } from "@mantine/core";
import { dark } from "@clerk/themes";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import { ApplicationShell } from "@/components/core/appshell";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5c5f66",
      "#373A40",
      "#2C2E33",
      "#25262b",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
  },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Style War</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider theme={theme} defaultColorScheme="dark">
        <QueryClientProvider client={queryClient}>
          <ClerkProvider
            appearance={{
              baseTheme: dark,
            }}
          >
            <ApplicationShell>
              <Component {...pageProps} />
            </ApplicationShell>
          </ClerkProvider>
        </QueryClientProvider>
      </MantineProvider>
    </>
  );
}
