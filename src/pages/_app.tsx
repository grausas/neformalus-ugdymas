import "@/styles/globals.css";
import "@/styles/map.css";
import type { AppProps } from "next/app";
import { Chakra } from "@/chakra";
import { MapProvider } from "@/context/map-context";
import Layout from "@/components/Layout";
import { Open_Sans } from "next/font/google";
import AuthProvider from "@/context/auth";

const montserrat = Open_Sans({ subsets: ["latin"], display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <style jsx global>
        {`
          :root {
            --font-rubik: ${montserrat.style.fontFamily};
          }
        `}
      </style>
      <Chakra>
        <Layout>
          <MapProvider>
            <Component {...pageProps} />
          </MapProvider>
        </Layout>
      </Chakra>
    </AuthProvider>
  );
}
