import "@/styles/globals.css";
import "@/styles/map.css";
import type { AppProps } from "next/app";
import { Chakra } from "@/chakra";
import { MapProvider } from "@/context/map-context";
import Layout from "@/components/Layout";
import { Open_Sans, Poppins } from "next/font/google";
import AuthProvider from "@/context/auth";

const openSans = Open_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["400", "500", "600"],
});
const poppins = Poppins({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <style jsx global>
        {`
          :root {
            --font-openSans: ${openSans.style.fontFamily};
            --font-poppins: ${poppins.style.fontFamily};
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
