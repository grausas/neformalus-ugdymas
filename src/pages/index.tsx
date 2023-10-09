import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
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
  const [filteredData, setFilteredData] = useState<__esri.Graphic[]>([]);
  const [objIds, setObjIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [whereParams, setWhereParams] = useState(defaultWhereParams);
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [nvs, setNvs] = useState<number | undefined>();
  const [classFilter, setClassFilter] = useState<
    { name?: string | undefined; value?: number | undefined }[] | undefined
  >([]);
  const [group, setGroup] = useState(defaultGroup);
  const [activeServiceArea, setActiveServiceArea] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  useEffect(() => {
    setWhereParams(whereParamsChange(activities, group, nvs, classFilter));
  }, [activities, group, nvs, classFilter]);

  console.log("whereParams", whereParams);

  useEffect(() => {
    if (objIds.length === 0) return;
    const filterDataOnClick = async () => {
      console.log("objectIds", objIds);
      const filteredArray = await data.filter((item) => {
        return objIds.includes(item.attributes.OBJECTID);
      });
      console.log("filteredArray", filteredArray);
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

    const objectIds = featureResults.features.map((f) => f.attributes.OBJECTID);
    console.log("objectIds", objectIds);

    if (objectIds.length > 0) {
      const relatedFeatures = await layer.queryRelatedFeatures({
        outFields: relatedFeaturesFields,
        relationshipId: layer.relationships[0].id,
        objectIds: objectIds,
        where: whereParams,
      });
      console.log("relatedFeatures", relatedFeatures);

      const globalIdsAsNumber = Object.keys(relatedFeatures).map(Number);
      console.log("globalIdsAsNumber", globalIdsAsNumber);

      if (whereParams) {
        const filteredFeatures = featureResults.features.filter((f) => {
          return globalIdsAsNumber.includes(f.attributes.OBJECTID);
        });

        console.log("whereParams", whereParams);
        const featureFilter = await new FeatureFilter({
          where: "OBJECTID IN (" + globalIdsAsNumber + ")",
        });
        console.log("featureFilter", featureFilter);
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

    console.log("featureResults", featureResults);
    setData(featureResults.features);
    setLoading(false);
  };

  useEffect(() => {
    if (!view) return;
    const handles = new Handles();
    const layer = view.map.layers.getItemAt(0) as __esri.FeatureLayer;
    const publicLayer = featureLayerPublic();

    setFeatureLayer(layer);

    view.whenLayerView(layer).then((layerView) => {
      queryFeatures(publicLayer, layerView);

      // subsequent map interaction
      handles.add(
        reactiveUtils.watch(
          () => [view.stationary, view.extent],
          ([stationary]) => {
            if (stationary) {
              promiseUtils.debounce(queryFeatures(publicLayer, layerView));
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
    // check if null
    console.log("activeServiceAreasssssss", activeServiceArea);
    calculateArea(view, activeServiceArea);
  }, [activeServiceArea, view]);

  console.log("activeServiceArea", activeServiceArea);

  // filter features on map click
  useEffect(() => {
    if (view && featureLayer) {
      view.on("click", async (event) => {
        console.log("event", event);
        const response = await view.hitTest(event, {
          include: featureLayer,
        });
        view.whenLayerView(featureLayer).then(async (layerView) => {
          if (response.results.length) {
            setLoading(true);
            view.graphics.removeAll();
            let objectIds: number[] = [];

            const results = response.results;
            console.log("response", response.results);
            // @ts-ignore
            if (results[0].graphic.attributes.aggregateId) {
              const query = layerView.createQuery();
              // @ts-ignore
              const aggregateId = results[0].graphic.attributes.aggregateId;
              // @ts-ignore
              const clusterGeometry = results[0].graphic.geometry;

              query.aggregateIds = [aggregateId];
              console.log("query", query);
              const { features } = await layerView.queryFeatures(query);
              const uniqueFeatures = features.filter(
                (obj, index) =>
                  features.findIndex(
                    (item) =>
                      item.attributes.VEIKLAID === obj.attributes.VEIKLAID
                  ) === index
              );

              console.log("uniqueFeatures", uniqueFeatures);

              objectIds = features.map((f) => f.attributes.OBJECTID);
              setObjIds(objectIds);
              console.log("objectIds", objectIds);
              console.log("data", data);

              console.log("features", features);

              const radius =
                uniqueFeatures.length < 8 ? view.scale / 85 : view.scale / 70;

              const points = calculatePointsAroundCenter(
                clusterGeometry,
                uniqueFeatures.length,
                radius
              );

              console.log("points", points);

              let pointUrl: string;

              // const graphicArray: Graphic[] = [];
              const graphicArray: Graphic[] = [];
              uniqueFeatures.forEach((feature, index) => {
                const activity = ActivitiesData.find(
                  (activity) => feature.attributes.VEIKLAID === activity.value
                );

                if (activity && index < points.length) {
                  console.log("poitn", points);
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
              console.log("graphicArray", graphicArray);

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
              console.log("view", view);
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
                  url: pointUrl,
                  width: "25px",
                  height: "25px",
                },
              });

              view.graphics.add(graphic);
            }
            console.log("objectIdsHere", objectIds);
            const featureFilter = new FeatureFilter({
              objectIds: objectIds,
            });
            console.log("featureFilter", featureFilter);

            layerView.featureEffect = new FeatureEffect({
              filter: featureFilter,
              excludedEffect: "grayscale(100%) opacity(30%)",
            });
          } else {
            console.log("hererere");
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

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      gap="0"
      position="relative"
    >
      <Button
        display={{ base: "block", md: "none" }}
        size="sm"
        w="120px"
        position="absolute"
        top="90%"
        left="calc(50% - 60px)"
        onClick={isOpen ? onClose : onOpen}
        zIndex={999}
        bg={isOpen ? "brand.40" : "brand.10"}
        color={isOpen ? "brand.10" : "brand.40"}
      >
        {isOpen ? "Žemėlapis" : filteredData.length + " Sąrašas"}
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
              h={{ base: "calc(100vh - 190px)", md: "calc(100vh - 200px)" }}
              overflow="auto"
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
                filteredData.map((item) => (
                  <Card key={item.attributes.OBJECTID} cardData={item} />
                ))}
              {!loading && data.length === 0 && <NoResults />}
            </Stack>
          </Box>
        )}
      </Flex>
      <Box
        position={isOpen ? "absolute" : "relative"}
        zIndex="0"
        w="100%"
        h={{ base: "calc(100vh - 155px)", md: "calc(100vh - 64px)" }}
        bg="brand.10"
      >
        <ServiceArea handleServiceArea={handleServiceArea} />
        <ArcGISMap />
        {auth.user.token && <Form auth={auth.user.token} view={view} />}
      </Box>
    </Stack>
  );
}
