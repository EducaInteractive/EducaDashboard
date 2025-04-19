import "@/styles/globals.css";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useRouter } from 'next/router';
import AuthGuard from "@/components/AuthGuard";
import { DisabledProvider } from "@/contexts/DisabledContext";

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const authPages = ['/login'];
  const isAuthPage = authPages.includes(router.pathname);

  if (isAuthPage) {
    return (
      <AuthLayout>
        <Component {...pageProps} />
      </AuthLayout>
    );
  }

  return (
    <AuthGuard>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AuthGuard>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {

  return (
    <SessionProvider session={session}>
      <DisabledProvider>
        <Head>
          <title>App Educa</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="bg-gray-50 font-serif">
          <AppContent
            Component={Component}
            pageProps={pageProps}
          />
        </div>
      </DisabledProvider>
    </SessionProvider>
  );
}