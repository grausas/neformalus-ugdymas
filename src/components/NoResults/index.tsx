import { Box, Text, Icon, Flex, Heading } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

export default function NoResults() {
  return (
    <Box
      textAlign="center"
      mt="6"
      border="1px solid"
      borderColor="brand.11"
      px="4"
      py="8"
      borderRadius="md"
      shadow="sm"
    >
      <Flex align="center" justify="center">
        <Icon as={WarningIcon} mr="2" color="brand.30" boxSize="5" />
        <Heading fontSize="2xl" lineHeight="2">
          Rezultatų nerasta
        </Heading>
      </Flex>
      <Text>
        Bandykite išvalyti paieškos filtrus arba pakeisti žemėlapio padėtį
      </Text>
    </Box>
  );
}
