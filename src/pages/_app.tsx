import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Chakra } from "@/chakra";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Chakra>
      <Component {...pageProps} />
    </Chakra>
  );
}
