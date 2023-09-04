import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Chakra } from "@/chakra";
import Layout from "@/components/Layout";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Chakra>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Chakra>
  );
}
