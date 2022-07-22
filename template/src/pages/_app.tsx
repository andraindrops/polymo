import { ReactElement, ReactNode } from "react";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";

import { SessionProvider } from "next-auth/react";

import "@/styles/globals.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout): ReactNode => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <SessionProvider session={session}>
      <Head>
        <title>Example — description</title>
        <meta property="og:url" content="https://example.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Example" />
        <meta property="og:description" content="Example description" />
        <meta property="og:site_name" content="Example" />
        <meta property="og:image" content="https://example.com/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
