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
import Image from "../Image";
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
import { useMediaQuery } from "@chakra-ui/react";

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
    const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

    const filteredClass = klaseArr.find((klase) => {
      cardData.attributes.relatedFeatures &&
        cardData.attributes.relatedFeatures.map((f: any) => {
          if (classArr.includes(klase)) return;
          if (f.attributes[klase] === 1) {
            return classArr.push(klase);
          }
        });
    });

    let highlight: any;

    const zoomToFeature = async (results: any) => {
      if (!view || !layer) return;
      view?.whenLayerView(layer).then((layerView) => {
        view?.goTo(
          {
            target: results.geometry,
            zoom: 17,
          },
          { duration: 400 }
        );
        const featureFilter = new FeatureFilter({
          where: "OBJECTID = " + results.attributes.OBJECTID,
        });

        layerView.featureEffect = new FeatureEffect({
          filter: featureFilter,
          excludedEffect: "grayscale(100%) opacity(30%)",
        });

        let query = layer.createQuery();
        query.where = "OBJECTID = " + results.attributes.OBJECTID;
        layer.queryFeatures(query).then(function (result) {
          highlight?.remove();
          highlight = layerView.highlight(result.features);
        });
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
                      <Box>
                        <Image
                          width={24}
                          height={24}
                          src={item.icon}
                          alt={item.text}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                );
              }
            });
          })}
        </Flex>
        <Flex alignItems="center">
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
            <Flex alignItems="center" onClick={(e) => e.stopPropagation()}>
              <PhoneIcon mr="2" color="brand.40" />
              <a href={`tel:${cardData.attributes.TELEF_MOB}`}>
                <Text fontWeight="500">+{cardData.attributes.TELEF_MOB}</Text>
              </a>
            </Flex>
          )}
          {cardData.attributes.TELEFONAS && (
            <Flex alignItems="center" onClick={(e) => e.stopPropagation()}>
              <PhoneIcon mr="2" color="brand.40" />
              <a href={`tel:${cardData.attributes.TELEFONAS}`}>
                <Text fontWeight="500">{cardData.attributes.TELEFONAS}</Text>
              </a>
            </Flex>
          )}
          {cardData.attributes.NUORODA && (
            <Flex alignItems="center">
              <ExternalLinkIcon mr="2" color="brand.40" />
              <Link
                href={`http://${cardData.attributes.NUORODA}`}
                isExternal
                fontWeight="500"
                _hover={{ color: "brand.31", textDecoration: "underline" }}
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
                      <Tooltip
                        key={activity.id}
                        label={activity.text}
                        fontSize="sm"
                        bg="brand.30"
                        color="brand.50"
                      >
                        <Box mr="1" shadow="md">
                          <Image
                            width={24}
                            height={24}
                            src={activity.url}
                            alt={activity.text}
                          />
                        </Box>
                      </Tooltip>
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
                    <Box>
                      <Image
                        width={24}
                        height={24}
                        src={isNvsKrepse === 1 ? nvs : nonvs}
                        alt={tooltipLabel}
                      />
                    </Box>
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
