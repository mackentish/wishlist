import { Layout } from '@/components';
import { ThemeProvider } from '@/hooks';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5,
        },
    },
});

export default function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <SessionProvider session={session} refetchOnWindowFocus={false}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <Head>
                        <link
                            rel="icon"
                            href="/icon?<generated>"
                            type="image/png"
                        />
                    </Head>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
