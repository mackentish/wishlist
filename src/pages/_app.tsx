import { Layout } from '@/components';
import { ThemeProvider } from '@/hooks';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 2, // 2 minutes
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
                {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools
                        initialIsOpen={false}
                        buttonPosition="top-right"
                        client={queryClient}
                    />
                )}
            </QueryClientProvider>
        </SessionProvider>
    );
}
