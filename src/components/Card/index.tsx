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
import facebook from "@/assets/facebook.svg";
import nvs from "@/assets/nvs.svg";
import nonvs from "@/assets/nonvs.svg";

export default function Card({
  cardData,
  view,
}: {
  cardData: __esri.Graphic;
  view?: __esri.MapView;
}) {
  const klaseArr = ["KLASE_1_4", "KLASE_5_8", "KLASE_9_12"];

  // const hasNvsKrepse =
  //   cardData.attributes.relatedFeatures &&
  //   cardData.attributes.relatedFeatures.some(
  //     (related: any) => related.attributes.NVS_KREPSE === 1
  //   );

  // console.log(hasNvsKrepse);
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

  const zoomToFeature = async (results: any) => {
    console.log("resultsSSS", results);
    view?.goTo(
      {
        target: results,
        zoom: 17,
      },
      { duration: 400 }
    );
  };

  return (
    <Flex
      direction="column"
      bg="brand.10"
      p="4"
      rounded="lg"
      // shadow="sm"
      border="1px solid"
      borderColor="brand.11"
      position="relative"
      _hover={{
        borderColor: "brand.21",
        transition: "0.3s ease-in-out",
        shadow: "md",
        // pt: "10",
      }}
      onClick={() => {
        zoomToFeature(cardData.geometry);
      }}
    >
      <Flex flexDirection="column" position="absolute" right="4">
        {classArr.map((arrItem: any) => {
          return ClassData.map((item) => {
            if (arrItem === item.value) {
              return (
                <Box key={item.id} mb="1" shadow="md">
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
      <Flex alignItems="center">
        {/* <Image width={16} height={16} src={location} alt="adresas" /> */}
        <Text color="brand.21" fontWeight="600" fontSize="sm">
          {cardData.attributes.ADRESAS}
        </Text>
      </Flex>
      <Heading size="md" color="brand.50" pr="8" fontWeight="600">
        {cardData.attributes.PAVADIN}
      </Heading>
      <Stack color="brand.40" my="2" spacing="0" minH="40px" fontSize="md">
        {cardData.attributes.EL_PASTAS && (
          <Flex alignItems="center">
            <EmailIcon mr="2" color="brand.40" />
            <Text>{cardData.attributes.EL_PASTAS}</Text>
          </Flex>
        )}
        {cardData.attributes.TELEF_MOB && (
          <Flex alignItems="center">
            <PhoneIcon mr="2" color="brand.40" />
            <Text>+{cardData.attributes.TELEF_MOB}</Text>
          </Flex>
        )}
        {cardData.attributes.TELEF && (
          <Flex alignItems="center">
            <PhoneIcon mr="2" color="brand.40" />
            <Text>{cardData.attributes.TELEF}</Text>
          </Flex>
        )}
        {cardData.attributes.NUORODA && (
          <Flex alignItems="center">
            <ExternalLinkIcon mr="2" color="brand.40" />
            <Link href={`http://${cardData.attributes.NUORODA}`} isExternal>
              {cardData.attributes.NUORODA}
            </Link>
          </Flex>
        )}
        {cardData.attributes.SOC_TINKL && (
          <Flex direction="row" align="center" mt="2">
            {/* <Text mr="2">Facebook:</Text> */}
            <Link href={cardData.attributes.SOC_TINKL} isExternal>
              <Image width={20} height={20} src={facebook} alt="facebook" />
            </Link>
          </Flex>
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
                    <Box key={activity.id} mr="1" shadow="md">
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
        <Flex justify="center" shadow="md">
          {Array.from(
            new Set(
              cardData.attributes.relatedFeatures?.map(
                (related: any) => related.attributes.NVS_KREPSE
              )
            )
          )
            .filter((isNvsKrepse) => isNvsKrepse)
            .map((isNvsKrepse, index) => {
              const tooltipLabel =
                isNvsKrepse === 1
                  ? "Taikomas NVŠ krepšelis"
                  : "Netaikomas NVŠ krepšelis";

              return (
                <Tooltip
                  key={index}
                  label={tooltipLabel}
                  fontSize="sm"
                  bg="brand.30"
                  color="brand.50"
                >
                  <Image
                    width={24}
                    height={24}
                    src={isNvsKrepse === 1 ? nvs : nonvs}
                    alt={tooltipLabel}
                  />
                </Tooltip>
              );
            })}
        </Flex>
      </Flex>
    </Flex>
  );
}
