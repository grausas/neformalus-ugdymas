import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const ArcGISMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
});
import {
  Box,
  Spinner,
  Flex,
  Stack,
  AbsoluteCenter,
  useDisclosure,
  Button,
  useMediaQuery,
  Link,
  Text,
} from "@chakra-ui/react";
import Card from "@/components/Card";
import Filter from "@/components/Filter";
import AppliedFilters from "@/components/AppliedFilters";
import Search from "@/components/Search";
import NoResults from "@/components/NoResults";
import Form from "@/components/admin/Form";
import Handles from "@arcgis/core/core/Handles.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter.js";
import FeatureEffect from "@arcgis/core/layers/support/FeatureEffect.js";
import { MapContext } from "@/context/map-context";
import { AuthContext } from "@/context/auth";
import { featuresFields, relatedFeaturesFields } from "@/utils/featureLayer";
import { whereParamsChange } from "@/helpers/whereParams";
import { featureLayerPublic } from "@/layers";
import Graphic from "@arcgis/core/Graphic";
import { ActivitiesData } from "@/utils/activitiesData";
import Point from "@arcgis/core/geometry/Point.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import GroupTabs from "@/components/GroupTabs";
import { calculateArea } from "@/helpers/calculateArea";
import ServiceArea from "@/components/ServiceArea";
import EditForm from "@/components/admin/EditForm";
import { SearchIcon, HamburgerIcon } from "@chakra-ui/icons";

const defaultWhereParams = "1=1";
const defaultGroup = 1;

function calculatePointsAroundCenter(
  centerPoint: { x: number; y: number; spatialReference: any },
  numPoints: number,
  radius: number
) {
  const points = [];
  const angleIncrement = (2 * Math.PI) / numPoints;

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleIncrement;
    const x = centerPoint.x + radius * Math.cos(angle);
    const y = centerPoint.y + radius * Math.sin(angle);
    const point = new Point({
      x,
      y,
      spatialReference: centerPoint.spatialReference,
    });
    points.push(point);
  }

  return points;
}

export default function Map() {
  const { view } = useContext(MapContext);
  const [featureLayer, setFeatureLayer] = useState<
    __esri.FeatureLayer | undefined
  >();
  const auth = useContext(AuthContext);
  const [data, setData] = useState<__esri.Graphic[]>([]);
  const [editData, setEditData] = useState<__esri.Graphic>();
  const [filteredData, setFilteredData] = useState<__esri.Graphic[]>([]);
  const [objIds, setObjIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState(false);
  const [whereParams, setWhereParams] = useState(defaultWhereParams);
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [nvs, setNvs] = useState<number | undefined>();
  const [classFilter, setClassFilter] = useState<
    { name?: string | undefined; value?: number | undefined }[] | undefined
  >([]);
  const [group, setGroup] = useState(defaultGroup);
  const [activeServiceArea, setActiveServiceArea] = useState(false);
  const [isMobile] = useMediaQuery("(min-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: isMobile === true ? false : true,
  });
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    setWhereParams(whereParamsChange(activities, group, nvs, classFilter));
  }, [activities, group, nvs, classFilter]);

  useEffect(() => {
    if (view) {
      view.goTo({
        target: [25.28093, 54.681],
        zoom: 13,
      });
      setActivities([]);
      setNvs(undefined);
      setClassFilter([]);
    }
  }, [group, view]);

  useEffect(() => {
    if (objIds.length === 0) return;
    const filterDataOnClick = async () => {
      const filteredArray = await data.filter((item) => {
        return objIds.includes(item.attributes.OBJECTID);
      });
      setFilteredData(filteredArray);
      setLoading(false);
    };

    filterDataOnClick();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objIds]);

  const queryFeatures = async (
    layer: __esri.FeatureLayer,
    layerView: __esri.FeatureLayerView
  ) => {
    view?.graphics.removeAll();
    setLoading(true);
    layerView.featureEffect = new FeatureEffect({
      excludedEffect: "opacity(100%)",
    });

    const featureResults = await layer.queryFeatures({
      returnGeometry: true,
      geometry: view?.extent,
      outFields: featuresFields,
    });

    const queryParameters = new URLSearchParams(window.location.search);
    const shareID = queryParameters.get("id");

    const objectIds = featureResults.features.map((f) => f.attributes.OBJECTID);

    if (objectIds.length > 0) {
      const relatedFeatures = await layer.queryRelatedFeatures({
        outFields: relatedFeaturesFields,
        relationshipId: layer.relationships[0].id,
        objectIds: objectIds,
        where: whereParams,
      });

      const globalIdsAsNumber = Object.keys(relatedFeatures).map(Number);

      if (whereParams) {
        const filteredFeatures = featureResults.features.filter((f) => {
          return globalIdsAsNumber.includes(f.attributes.OBJECTID);
        });

        const featureFilter = await new FeatureFilter({
          where:
            "OBJECTID IN (" +
            globalIdsAsNumber.join(",") +
            ") AND VEIKLAGRID = " +
            group,
        });
        layerView.filter = featureFilter;

        featureResults.features = filteredFeatures;
      } else {
        const featureFilter = new FeatureFilter({});
        layerView.filter = featureFilter;
      }

      if (globalIdsAsNumber.length > 0) {
        globalIdsAsNumber.forEach((objectId) => {
          if (relatedFeatures[objectId]) {
            const key = "relatedFeatures";
            featureResults.features.forEach((f) => {
              if (f.attributes.OBJECTID === objectId) {
                f.attributes[key] = relatedFeatures[objectId].features;
              }
            });
          }
        });
      }
    }

    if (shareID) {
      const feature = featureResults.features.filter((f) => {
        return f.attributes.OBJECTID === Number(shareID);
      });
      const featureFilter = new FeatureFilter({
        where: "OBJECTID = " + shareID,
      });
      //  layerView.featureEffect = new FeatureEffect({
      //    filter: featureFilter,
      //    excludedEffect: "grayscale(100%) opacity(30%)",
      //  });
      if (view?.zoom !== 17) {
        await view?.goTo({
          target: feature[0].geometry,
          zoom: 17,
        });
      }
      layerView.filter = featureFilter;
      setData(feature);
    } else {
      setData(featureResults.features);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!view) return;
    const handles = new Handles();
    const layer = view.map.layers.getItemAt(0) as __esri.FeatureLayer;
    const publicLayer = featureLayerPublic();

    setFeatureLayer(layer);

    view.whenLayerView(layer).then(async (layerView) => {
      await queryFeatures(publicLayer, layerView);

      // subsequent map interaction
      handles.add(
        reactiveUtils.watch(
          () => [view.stationary, view.extent],
          async ([stationary]) => {
            if (stationary) {
              await promiseUtils.debounce(
                queryFeatures(publicLayer, layerView)
              );
              router.push("/");
            }
          }
        )
      );
    });

    return () => handles.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, whereParams]);

  // use useMemo to setFilteredData when data changes
  useMemo(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (!view) return;
    calculateArea(view, activeServiceArea, setLoadingMap);
  }, [activeServiceArea, view]);

  // filter features on map click
  useEffect(() => {
    if (view && featureLayer) {
      view.on("click", async (event) => {
        if (view.zoom < 12) return;
        const response = await view.hitTest(event, {
          include: featureLayer,
        });
        view.whenLayerView(featureLayer).then(async (layerView) => {
          if (response.results.length) {
            setLoading(true);
            view.graphics.removeAll();
            let objectIds: number[] = [];

            const results = response.results;
            // @ts-ignore
            if (results[0].graphic.attributes.aggregateId) {
              const query = layerView.createQuery();
              // @ts-ignore
              const aggregateId = results[0].graphic.attributes.aggregateId;
              // @ts-ignore
              const clusterGeometry = results[0].graphic.geometry;

              query.aggregateIds = [aggregateId];
              const { features } = await layerView.queryFeatures(query);
              const uniqueFeatures = features.filter(
                (obj, index) =>
                  features.findIndex(
                    (item) =>
                      item.attributes.VEIKLAID === obj.attributes.VEIKLAID
                  ) === index
              );

              objectIds = features.map((f) => f.attributes.OBJECTID);
              setObjIds(objectIds);
              const radius =
                uniqueFeatures.length < 8 ? view.scale / 85 : view.scale / 70;

              const points = calculatePointsAroundCenter(
                clusterGeometry,
                uniqueFeatures.length,
                radius
              );

              let pointUrl: string;

              // const graphicArray: Graphic[] = [];
              const graphicArray: Graphic[] = [];
              uniqueFeatures.forEach((feature, index) => {
                const activity = ActivitiesData.find(
                  (activity) => feature.attributes.VEIKLAID === activity.value
                );

                if (activity && index < points.length) {
                  const point = points[index];
                  const pointUrl = activity.url;

                  const graphic = new Graphic({
                    geometry: point,
                    attributes: feature.attributes,
                    symbol: {
                      // @ts-ignore
                      type: "picture-marker",
                      url: pointUrl,
                      width: "25px",
                      height: "25px",
                    },
                  });
                  const startPoint = [
                    // @ts-ignore
                    results[0].graphic.geometry.x,
                    // @ts-ignore
                    results[0].graphic.geometry.y,
                  ];
                  const endPoint = [point.x, point.y];

                  const line = new Polyline({
                    paths: [[startPoint, endPoint]],
                    spatialReference: view.spatialReference,
                  });

                  const lineSymbol = {
                    type: "simple-line",
                    color: "#f15a24",
                    width: 1,
                  };
                  const lineGraphic = new Graphic({
                    geometry: line,
                    symbol: lineSymbol,
                  });

                  graphicArray.push(lineGraphic);
                  graphicArray.push(graphic);
                }
              });

              const centerPoint = {
                // @ts-ignore
                type: "simple-marker",
                color: "#f15a24",
                size: 26,
                outline: {
                  color: "#fffffe",
                  width: 1,
                },
              };

              const centerPointGraphic = new Graphic({
                // @ts-ignore
                geometry: results[0].graphic.geometry,
                symbol: centerPoint,
              });

              view.graphics.addMany(graphicArray);
              view.graphics.add(centerPointGraphic);
            } else {
              //@ts-ignore
              objectIds = [results[0].graphic.attributes.OBJECTID];
              setObjIds(objectIds);
              const activity = ActivitiesData.find(
                (activity) =>
                  //@ts-ignore
                  results[0].graphic.attributes.VEIKLAID === activity.value
              );

              const pointUrl = activity?.url;

              const graphic = new Graphic({
                //@ts-ignore
                geometry: results[0].graphic.geometry,
                //@ts-ignore
                attributes: results[0].graphic.attributes,
                symbol: {
                  // @ts-ignore
                  type: "picture-marker",
                  url: pointUrl ? pointUrl : "/kitos.svg",
                  width: "25px",
                  height: "25px",
                },
              });

              view.graphics.add(graphic);
            }
            const featureFilter = new FeatureFilter({
              objectIds: objectIds,
            });

            layerView.featureEffect = new FeatureEffect({
              filter: featureFilter,
              excludedEffect: "grayscale(100%) opacity(30%)",
            });
          } else {
            layerView.featureEffect = new FeatureEffect({
              excludedEffect: "opacity(100%)",
            });
            view.graphics.removeAll();
            setObjIds([]);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, featureLayer]);

  const handleFilter = useCallback(
    (
      activity: string[],
      nvsKrepse: number | undefined,
      classFilter:
        | { name?: string | undefined; value?: number | undefined }[]
        | undefined
    ) => {
      setActivities(activity);
      setNvs(nvsKrepse);
      setClassFilter(classFilter);
    },
    []
  );

  const handleServiceArea = (e: boolean) => {
    if (e) {
      setActiveServiceArea(true);
    } else {
      setActiveServiceArea(false);
    }
  };

  const handleEdit = (e: __esri.Graphic) => {
    if (!view || !featureLayer) return;
    setEditData(e);

    view?.whenLayerView(featureLayer).then((layerView) => {
      const objectIds = e.attributes.relatedFeatures.map(
        (f: __esri.Graphic) => f.attributes.OBJECTID
      );

      const featureFilter = new FeatureFilter({
        objectIds: objectIds,
        // where: "OBJECTID = 66",
      });

      layerView.featureEffect = new FeatureEffect({
        filter: featureFilter,
        excludedEffect: "grayscale(100%) opacity(30%)",
      });
    });

    onOpenEdit();
  };

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      gap="0"
      position="relative"
      height={{ base: "calc(100dvh - 30px)", md: "auto" }}
      // overflow="hidden"
    >
      <Button
        display={{ base: "block", md: "none" }}
        size="sm"
        // width="20%"
        width="fit-content"
        position="absolute"
        bottom="10dvh"
        left="50%"
        transform="translateX(-50%)"
        onClick={isOpen ? onClose : onOpen}
        zIndex="999"
        bg={isOpen ? "brand.50" : "brand.10"}
        color={isOpen ? "brand.10" : "brand.40"}
        shadow="lg"
        sx={{ _hover: {} }}
        opacity="0.9"
        leftIcon={isOpen ? <SearchIcon /> : <HamburgerIcon />}
      >
        {loading
          ? "Kraunasi ..."
          : isOpen
          ? "Paieška žemėlapyje"
          : filteredData.length + " Sąrašas"}
      </Button>
      <Flex
        maxW="550px"
        w="100%"
        flexDirection="column"
        position="relative"
        px={{ base: "2", md: "3" }}
        gap="2"
        py="2"
        zIndex="1"
        bg="brand.20"
      >
        {/* <Search
          handleSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        /> */}
        <GroupTabs changeGroup={(e) => setGroup(e)} loading={loading} />
        <Flex direction="row" alignItems="center">
          <Filter
            handleFilter={handleFilter}
            loading={loading}
            group={group}
            view={view}
          />
          <Box
            display={{ base: "none", md: "block" }}
            w="100%"
            textAlign="right"
            fontSize="sm"
          >
            Rodoma {!loading ? filteredData.length : "..."}
          </Box>
        </Flex>

        {isOpen && (
          <Box>
            {/* {activities.length > 0 && <AppliedFilters activities={activities} />} */}
            {loading && (
              <AbsoluteCenter axis="both">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="brand.10"
                  size="xl"
                  color="brand.31"
                />
              </AbsoluteCenter>
            )}
            <Stack
              h={{ base: "calc(100dvh - 188px)", md: "calc(100vh - 200px)" }}
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  height: "8px",
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#f15a24",
                  borderRadius: "24px",
                },
              }}
            >
              {!loading &&
                filteredData.length > 0 &&
                filteredData.map((item, index) => (
                  <Card
                    key={item.attributes.OBJECTID}
                    cardData={item}
                    view={view}
                    auth={auth}
                    handleEdit={handleEdit}
                    FeatureFilter={FeatureFilter}
                    FeatureEffect={FeatureEffect}
                    layer={featureLayer}
                  />
                ))}

              {!loading && data.length === 0 && <NoResults />}
            </Stack>
          </Box>
        )}
      </Flex>
      <Box
        position={{ base: "absolute", md: "relative" }}
        bottom={{ base: "3", md: "unset" }}
        zIndex="0"
        w="100%"
        h={{ base: "calc(100dvh - 168px)", md: "calc(100vh - 64px)" }}
        bg="brand.10"
      >
        <ServiceArea handleServiceArea={handleServiceArea} />
        {loadingMap && (
          <Box
            bg="rgba(79, 79, 79, 0.1)"
            w="100%"
            h="100%"
            zIndex="999"
            position="absolute"
            top="0"
            left="0"
          >
            <Spinner
              thickness="2px"
              speed="0.65s"
              emptyColor="brand.10"
              size="lg"
              position="absolute"
              top="50%"
              left="50%"
              zIndex="999"
            />
          </Box>
        )}
        <ArcGISMap />
        {auth.user.token && <Form auth={auth.user.token} view={view} />}
        {auth.user.token && editData && (
          <EditForm
            isOpen={isOpenEdit}
            onClose={onCloseEdit}
            editData={editData}
            view={view}
          />
        )}
        <Link href="https://www.vilniausplanas.lt/">
          <Flex position="absolute" bottom="2" right="2" px="1">
            <Text fontSize="xs" color="brand.50">
              &copy; {new Date().getFullYear()} Vilniaus planas
            </Text>
          </Flex>
        </Link>
      </Box>
    </Stack>
  );
}
