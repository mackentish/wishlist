import type { AppProps } from "next/app";
import { Layout } from "@/components";
import RootLayout from "@/app/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RootLayout>
  );
}
