import { Button, Box } from "@chakra-ui/react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });

export default function Home() {
  return (
    <>
      <Button bg="brand.30">Hello</Button>
    </>
  );
}
