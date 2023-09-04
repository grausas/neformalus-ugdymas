import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import theme from "./theme";

interface Props {
  children?: ReactNode;
}

export function Chakra({ children }: Props) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
