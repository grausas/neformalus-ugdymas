import React from "react";
import { Flex, Text, Heading, Box } from "@chakra-ui/react";

export default function Card({ cardData }: { cardData: __esri.Graphic }) {
  return (
    <Flex direction="column" bg="brand.20" p="3" rounded="xl" shadow="md">
      <Heading size="md" color="brand.50">
        {cardData.attributes.PAVADIN}
      </Heading>
      <Box color="brand.40">
        <Text>{cardData.attributes.EL_PASTAS}</Text>
        <Text>{cardData.attributes.ADRESAS}</Text>
        <Text>{cardData.attributes.NUORODA}</Text>
        <Text>{cardData.attributes.PASTABA}</Text>
        <Text>{cardData.attributes.SOC_TINKL}</Text>
        <Text>{cardData.attributes.TELEFONAS}</Text>
        <Text>{cardData.attributes.TELEF_MOB}</Text>
      </Box>
    </Flex>
  );
}
