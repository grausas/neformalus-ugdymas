import React from "react";
import ArcGISMap from "@/components/Map";
import { Box, HStack, Text, Flex, Stack } from "@chakra-ui/react";

export default function index() {
  return (
    <Stack direction="row">
      <Flex minW="500px" flexDirection="column">
        <Text>Neformalaus ugdymo būreliai</Text>
      </Flex>
      <Box position="relative" w="100%" h="calc(100vh - 64px)">
        <ArcGISMap />
      </Box>
    </Stack>
  );
}
