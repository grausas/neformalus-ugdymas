import "@/styles/globals.css";
import "@/styles/map.css";
import type { AppProps } from "next/app";
import { Chakra } from "@/chakra";
import { MapProvider } from "@/context/map-context";
import Layout from "@/components/Layout";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Chakra>
      <Layout>
        <MapProvider>
          <Component {...pageProps} />
        </MapProvider>
      </Layout>
    </Chakra>
  );
}
