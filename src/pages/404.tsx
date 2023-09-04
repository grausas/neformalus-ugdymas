import Link from "next/link";

import { Box, Text } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Box maxW="1440px" px="4">
      <h1>Puslapis nerastas</h1>
      <Text>Kažkas nutiko. Toks puslapis nerastas!</Text>
      <Link href="/">Grįžti į pagrindinį puslapį</Link>
    </Box>
  );
}
