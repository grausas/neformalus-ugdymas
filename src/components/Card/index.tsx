import React from "react";
import { Flex, Text, Heading, Box, Tooltip, Link } from "@chakra-ui/react";
import { CategoryData } from "@/utils/categoryData";
import Image from "next/image";
import { EmailIcon, PhoneIcon, ExternalLinkIcon } from "@chakra-ui/icons";

export default function Card({ cardData }: { cardData: __esri.Graphic }) {
  return (
    <Flex direction="column" bg="brand.20" p="3" rounded="xl" shadow="md">
      <Heading size="md" color="brand.50">
        {cardData.attributes.PAVADIN}
      </Heading>
      <Box color="brand.40" mt="2">
        <Text>{cardData.attributes.ADRESAS}</Text>
        <Flex alignItems="center">
          <EmailIcon mr="2" color="brand.30" />
          <Text>{cardData.attributes.EL_PASTAS}</Text>
        </Flex>
        <Flex alignItems="center">
          <ExternalLinkIcon mr="2" color="brand.30" />
          <Link href={`http://${cardData.attributes.NUORODA}`} isExternal>
            {cardData.attributes.NUORODA}
          </Link>
        </Flex>
        <Text>{cardData.attributes.PASTABA}</Text>
        <Text>{cardData.attributes.SOC_TINKL}</Text>
        <Flex alignItems="center">
          <PhoneIcon mr="2" color="brand.30" />
          <Text>+{cardData.attributes.TELEF_MOB}</Text>
        </Flex>
        <Text>{cardData.attributes.TELEFONAS}</Text>
        <Flex justifyContent="flex-end" mt="1">
          {cardData.attributes.relatedFeatures.map((related: any) => {
            return CategoryData.map((category) => {
              if (related.attributes.LO_VEIKLA === category.value) {
                return (
                  <Flex justify="center" key={category.id} ml="2">
                    <Tooltip
                      label={category.text}
                      fontSize="xs"
                      bg="brand.30"
                      color="brand.50"
                    >
                      <Image
                        width={28}
                        height={28}
                        src={category.icon}
                        alt={category.text}
                      />
                    </Tooltip>
                  </Flex>
                );
              }
            });
          })}
        </Flex>
      </Box>
    </Flex>
  );
}
