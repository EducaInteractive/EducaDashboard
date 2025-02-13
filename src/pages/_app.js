import "@/styles/globals.css";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import { useState } from "react";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useRouter } from 'next/router';
import AuthGuard from "@/components/AuthGuard";
import { DisabledProvider } from "@/contexts/DisabledContext";

function AppContent({ Component, pageProps}) {
  const router = useRouter();
  const authPages = ['/login'];
  const isAuthPage = authPages.includes(router.pathname);

  if (isAuthPage) {
    return (
      <AuthLayout>
        <Component {...pageProps}  />
      </AuthLayout>
    );
  }

  return (
    <AuthGuard>
      <MainLayout>
        <Component {...pageProps}  />
      </MainLayout>
    </AuthGuard>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [disabled, setDisabled] = useState(false);

  return (
    <SessionProvider session={session}>
      <DisabledProvider>
        <Head>
          <title>App Educa</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <AppContent
          Component={Component}
          pageProps={pageProps}
        />
      </DisabledProvider>
    </SessionProvider>
  );
}