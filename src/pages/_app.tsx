// Reference: https://github.com/mui-org/material-ui/blob/master/examples/nextjs-with-typescript/pages/_app.tsx
import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { config } from "../env/config";
import { useState } from "react";
import { TopNav } from "../components/elements/TopNav";
import { Session } from "../types/web3/Session";
import "@hig/fonts/build/ArtifaktElement.css";
import "../styles/globals.css";

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [session] = useState<Session | undefined>({
    userPubKey: "0x000000042",
  });
  return (
    <>
      <Head>
        <title>{config.appName}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col h-screen w-screen">
          <div className="flex-shrink">
            <TopNav session={session} />
          </div>
          <div className="bg-light h-full">
            {session && <Component {...pageProps} />}
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
