// Reference: https://github.com/mui-org/material-ui/blob/master/examples/nextjs-with-typescript/pages/_app.tsx
import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";

import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import { QueryClient, QueryClientProvider } from "react-query";
import { config } from "../env/config";
import { TopNav } from "../components/elements/TopNav";
import "@hig/fonts/build/ArtifaktElement.css";
import "../styles/globals.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>{config.appName}</title>
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <QueryClientProvider client={queryClient}>
          <div className="flex flex-col h-screen w-screen">
            <div className="flex-shrink">
              <TopNav />
            </div>
            <div className="bg-light h-full">
              <Component {...pageProps} />
            </div>
          </div>
        </QueryClientProvider>
      </Web3ReactProvider>
    </>
  );
};

export default MyApp;
