import React from "react";
import { Flex, Text, Heading, Box, Tooltip, Link } from "@chakra-ui/react";
import { CategoryData } from "@/utils/categoryData";
import { ClassData } from "@/utils/classData";
import Image from "next/image";
import { EmailIcon, PhoneIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import location from "@/assets/location.svg";
import nvs from "@/assets/nvs.svg";
import nonvs from "@/assets/nonvs.svg";

export default function Card({ cardData }: { cardData: __esri.Graphic }) {
  const klaseArr = ["KLASE_1_4", "KLASE_5_8", "KLASE_9_12"];

  const hasNvsKrepse =
    cardData.attributes.relatedFeatures &&
    cardData.attributes.relatedFeatures.some(
      (related: any) => related.attributes.NVS_KREPSE === 1
    );
  const classArr: any = [];

  const filteredClass = klaseArr.find((klase) => {
    cardData.attributes.relatedFeatures &&
      cardData.attributes.relatedFeatures.map((f: any) => {
        if (classArr.includes(klase)) return;
        if (f.attributes[klase] === 1) {
          return classArr.push(klase);
        }
      });
  });

  return (
    <Flex
      direction="column"
      bg="brand.10"
      p="3"
      rounded="xl"
      shadow="md"
      position="relative"
    >
      <Flex flexDirection="column" position="absolute" right="3">
        {classArr.map((arrItem: any) => {
          return ClassData.map((item) => {
            if (arrItem === item.value) {
              return (
                <Box key={item.id} mb="1">
                  <Tooltip
                    label={item.text}
                    fontSize="xs"
                    bg="brand.30"
                    color="brand.50"
                  >
                    <Image
                      width={24}
                      height={24}
                      src={item.icon}
                      alt={item.text}
                    />
                  </Tooltip>
                </Box>
              );
            }
          });
        })}
      </Flex>
      <Heading size="md" color="brand.50">
        {cardData.attributes.PAVADIN}
      </Heading>
      <Box color="brand.40" mt="2" mb="2">
        <Flex alignItems="center">
          <Image width={16} height={16} src={location} alt="adresas" />
          <Text ml="2" fontWeight="500">
            {cardData.attributes.ADRESAS}
          </Text>
        </Flex>
        <Flex alignItems="center">
          <EmailIcon mr="2" color="brand.30" />
          <Text>{cardData.attributes.EL_PASTAS}</Text>
        </Flex>
        <Text>{cardData.attributes.PASTABA}</Text>
        <Text>{cardData.attributes.SOC_TINKL}</Text>
        <Flex alignItems="center">
          <PhoneIcon mr="2" color="brand.30" />
          <Text>
            {cardData.attributes.TELEF_MOB
              ? "+" + cardData.attributes.TELEF_MOB
              : cardData.attributes.TELEF}
          </Text>
        </Flex>
        <Flex alignItems="center">
          <ExternalLinkIcon mr="2" color="brand.30" />
          <Link href={`http://${cardData.attributes.NUORODA}`} isExternal>
            {cardData.attributes.NUORODA}
          </Link>
        </Flex>
      </Box>
      <Flex justifyContent="space-between" mt="1">
        <Flex justify="center">
          <Tooltip
            label={
              hasNvsKrepse
                ? "Taikomas NVŠ krepšelis"
                : "Netaikomas NVŠ krepšelis"
            }
            fontSize="xs"
            bg="brand.30"
            color="brand.50"
          >
            <Image
              width={24}
              height={24}
              src={hasNvsKrepse ? nvs : nonvs}
              alt={
                hasNvsKrepse
                  ? "Taikomas NVŠ krepšelis"
                  : "Netaikomas NVŠ krepšelis"
              }
            />
          </Tooltip>
        </Flex>
        <Flex>
          {cardData.attributes.relatedFeatures &&
            cardData.attributes.relatedFeatures.map((related: any) => {
              return CategoryData.map((category) => {
                if (related.attributes.LO_VEIKLA === category.value) {
                  return (
                    <Box key={category.id} ml="1">
                      <Tooltip
                        label={category.text}
                        fontSize="xs"
                        bg="brand.30"
                        color="brand.50"
                      >
                        <Image
                          width={24}
                          height={24}
                          src={category.icon}
                          alt={category.text}
                        />
                      </Tooltip>
                    </Box>
                  );
                }
              });
            })}
        </Flex>
      </Flex>
    </Flex>
  );
}
