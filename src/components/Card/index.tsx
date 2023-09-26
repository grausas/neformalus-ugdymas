import React from "react";
import {
  Flex,
  Text,
  Heading,
  Box,
  Tooltip,
  Link,
  Stack,
} from "@chakra-ui/react";
import { ActivitiesData } from "@/utils/activitiesData";
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
      p="4"
      rounded="lg"
      shadow="sm"
      border="1px solid"
      borderColor="brand.11"
      position="relative"
      _hover={{
        cursor: "pointer",
        borderColor: "brand.21",
        transition: "0.3s ease-in-out",
      }}
    >
      <Flex flexDirection="column" position="absolute" right="4">
        {classArr.map((arrItem: any) => {
          return ClassData.map((item) => {
            if (arrItem === item.value) {
              return (
                <Box key={item.id} mb="1">
                  <Tooltip
                    label={item.text}
                    fontSize="sm"
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
      <Heading size="md" color="brand.50" pr="8" fontWeight="700">
        {cardData.attributes.PAVADIN}
      </Heading>
      <Stack color="brand.40" my="3" spacing="0" minH="40px">
        <Flex alignItems="center">
          <Image width={16} height={16} src={location} alt="adresas" />
          <Text ml="2">{cardData.attributes.ADRESAS}</Text>
        </Flex>
        {cardData.attributes.EL_PASTAS && (
          <Flex alignItems="center">
            <EmailIcon mr="2" color="brand.40" />
            <Text>{cardData.attributes.EL_PASTAS}</Text>
          </Flex>
        )}
        {(cardData.attributes.TELEF_MOB || cardData.attributes.TELEF) && (
          <Flex alignItems="center">
            <PhoneIcon mr="2" color="brand.40" />
            <Text>
              {cardData.attributes.TELEF_MOB
                ? "+" + cardData.attributes.TELEF_MOB
                : cardData.attributes.TELEF}
            </Text>
          </Flex>
        )}
        {cardData.attributes.NUOROD && (
          <Flex alignItems="center">
            <ExternalLinkIcon mr="2" color="brand.31" />
            <Link href={`http://${cardData.attributes.NUORODA}`} isExternal>
              {cardData.attributes.NUORODA}
            </Link>
          </Flex>
        )}
        {cardData.attributes.SOC_TINKL && (
          <Text>{cardData.attributes.SOC_TINKL}</Text>
        )}
        {cardData.attributes.PASTABA && (
          <Text fontSize="sm" pr="8">
            {cardData.attributes.PASTABA}
          </Text>
        )}
      </Stack>
      <Flex justifyContent="space-between" mt="1">
        <Flex>
          {cardData.attributes.relatedFeatures &&
            cardData.attributes.relatedFeatures.map((related: any) => {
              return ActivitiesData.map((activity) => {
                if (related.attributes.VEIKLAID === activity.value) {
                  return (
                    <Box key={activity.id} mr="1">
                      <Tooltip
                        label={activity.text}
                        fontSize="sm"
                        bg="brand.30"
                        color="brand.50"
                      >
                        <Image
                          width={24}
                          height={24}
                          src={activity.url}
                          alt={activity.text}
                        />
                      </Tooltip>
                    </Box>
                  );
                }
              });
            })}
        </Flex>
        <Flex justify="center">
          <Tooltip
            label={
              hasNvsKrepse
                ? "Taikomas NVŠ krepšelis"
                : "Netaikomas NVŠ krepšelis"
            }
            fontSize="sm"
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
      </Flex>
    </Flex>
  );
}
