import "@/styles/globals.css";
import "@/styles/map.css";
import type { AppProps } from "next/app";
import { Chakra } from "@/chakra";
import { MapProvider } from "@/context/map-context";
import Layout from "@/components/Layout";
import { Open_Sans } from "next/font/google";
import AuthProvider from "@/context/auth";
import Head from "next/head";

const openSans = Open_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <style jsx global>
        {`
          :root {
            --font-openSans: ${openSans.style.fontFamily};
          }
        `}
      </style>
      <Head>
        <title>Vilniaus miesto neformaliojo švietimo žemėlapis</title>
        <link rel="shortcut icon" href="/favicon.svg" />

        <meta
          name="description"
          content="Vilniaus miesto neformaliojo švietimo žemėlapis kuriame galima rasti neformaliojiojo vaikų švietimo būrelius ir kitas veiklas"
        />
        <meta
          property="og:title"
          content="Vilniaus miesto neformaliojo švietimo žemėlapis"
        />
        <meta
          property="og:description"
          content="Vilniaus miesto neformaliojo švietimo žemėlapis kuriame galima rasti neformaliojiojo vaikų švietimo būrelius ir kitas veiklas"
        />
        <meta property="og:image" content="" />
      </Head>

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
