// Reference: https://github.com/mui-org/material-ui/blob/master/examples/nextjs-with-typescript/pages/_app.tsx
import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { config } from "../env/config";
import { theme } from "../env/theme";
import { createEmotionCache } from "../env/createEmotionCache";
import { useState } from "react";
import { Box } from "@mui/material";
import { TopNav } from "../components/common/TopNav";
import { Session } from "../types/web3/Session";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const queryClient = new QueryClient();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps): JSX.Element => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [session] = useState<Session | undefined>({
    userPubKey: "0x000000042",
  });
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{config.appName}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Box
            style={{
              margin: 0,
              height: "100vh",
              display: "grid",
              gridTemplateRows: "auto 1fr",
            }}
          >
            <TopNav session={session} />
            {session && <Component {...pageProps} />}
          </Box>
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
