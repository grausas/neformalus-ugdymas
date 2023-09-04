import { Button, Box } from "@chakra-ui/react";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";

const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });

export default function Home() {
  return (
    <>
      <Button bg="brand.30">Hello</Button>
    </>
  );
}
