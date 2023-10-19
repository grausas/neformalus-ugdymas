import React from "react";
import {
  Flex,
  Text,
  Heading,
  Box,
  Tooltip,
  Link,
  Stack,
  forwardRef,
} from "@chakra-ui/react";
import { ActivitiesData } from "@/utils/activitiesData";
import { ClassData } from "@/utils/classData";
import Image from "next/image";
import {
  EmailIcon,
  PhoneIcon,
  ExternalLinkIcon,
  EditIcon,
} from "@chakra-ui/icons";
import facebook from "@/assets/facebook.svg";
import share from "@/assets/share.png";
import nvs from "@/assets/nvs.svg";
import nonvs from "@/assets/nonvs.svg";

const Card = forwardRef(
  (
    {
      cardData,
      view,
      auth,
      handleEdit,
      FeatureFilter,
      FeatureEffect,
      layer,
    }: {
      cardData: __esri.Graphic;
      view?: __esri.MapView;
      auth: any;
      handleEdit: (cardData: __esri.Graphic) => void;
      FeatureFilter?: any;
      FeatureEffect?: any;
      layer?: __esri.FeatureLayer;
    },
    ref
  ) => {
    const klaseArr = ["KLASE_1_4", "KLASE_5_8", "KLASE_9_12"];
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
      if (!view || !layer) return;
      view?.whenLayerView(layer).then((layerView) => {
        // const featureFilter = new FeatureFilter({
        //   objectIds: [results.attributes.OBJECTID],
        //   // where: "OBJECTID = 549",
        // });

        // console.log(featureFilter);

        // layerView.featureEffect = new FeatureEffect({
        //   filter: featureFilter,
        //   excludedEffect: "grayscale(100%) opacity(30%)",
        // });
        view?.goTo(
          {
            target: results.geometry,
            zoom: 17,
          },
          { duration: 400 }
        );
      });
    };

    const shareUrl = window.location.origin;

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
          zoomToFeature(cardData);
        }}
        ref={ref}
        w="100%"
        wordBreak="break-word"
      >
        {auth.user.token && (
          <Tooltip
            label="Redaguoti"
            fontSize="sm"
            bg="brand.30"
            color="brand.50"
          >
            <EditIcon
              boxSize="5"
              _hover={{ cursor: "pointer" }}
              onClick={(e) => {
                handleEdit(cardData);
                e.stopPropagation();
              }}
            />
          </Tooltip>
        )}

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
        <Flex mr="8" align="center">
          <Tooltip
            label="Dalintis"
            fontSize="sm"
            bg="brand.30"
            color="brand.50"
          >
            <Box
              position="absolute"
              left="3"
              onClick={(e) => {
                navigator.clipboard.writeText(
                  `${shareUrl}?id=${cardData.attributes.OBJECTID}`
                );
                e.stopPropagation();
              }}
            >
              <Image width={16} height={16} src={share} alt="adresas" />
            </Box>
          </Tooltip>
          <Heading size="md" color="brand.50" fontWeight="600" ml="5">
            {cardData.attributes.PAVADIN}
          </Heading>
        </Flex>
        <Stack color="brand.40" my="2" spacing="0" minH="40px" fontSize="md">
          {cardData.attributes.EL_PASTAS && (
            <Flex alignItems="center">
              <EmailIcon mr="2" color="brand.40" />
              <Text fontWeight="500">{cardData.attributes.EL_PASTAS}</Text>
            </Flex>
          )}
          {cardData.attributes.TELEF_MOB && (
            <Flex alignItems="center">
              <PhoneIcon mr="2" color="brand.40" />
              <Text fontWeight="500">+{cardData.attributes.TELEF_MOB}</Text>
            </Flex>
          )}
          {cardData.attributes.TELEFONAS && (
            <Flex alignItems="center">
              <PhoneIcon mr="2" color="brand.40" />
              <Text fontWeight="500">{cardData.attributes.TELEFONAS}</Text>
            </Flex>
          )}
          {cardData.attributes.NUORODA && (
            <Flex alignItems="center">
              <ExternalLinkIcon mr="2" color="brand.40" />
              <Link
                href={`http://${cardData.attributes.NUORODA}`}
                isExternal
                fontWeight="500"
              >
                {cardData.attributes.NUORODA}
              </Link>
            </Flex>
          )}

          {cardData.attributes.relatedFeatures[0].attributes.PEDAGOGAS && (
            <Flex direction="row" align="center">
              <Image
                width={16}
                height={16}
                src={"/teacher.svg"}
                alt="adresas"
              />
              <Text color="brand.40" fontWeight="500" ml="2">
                {cardData.attributes.relatedFeatures[0].attributes.PEDAGOGAS}
              </Text>
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
);

export default Card;
