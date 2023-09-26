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
import { Box, Spinner, Flex, Stack, AbsoluteCenter } from "@chakra-ui/react";
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
import { CategoryData } from "@/utils/categoryData";
import Point from "@arcgis/core/geometry/Point.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import GroupTabs from "@/components/GroupTabs";

const defaultWhereParams = "1=1";

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
  const [category, setCategory] = useState<string[]>([]);

  useEffect(() => {
    setWhereParams(whereParamsChange(category));
  }, [category]);

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
    setLoading(true);
    view?.graphics.removeAll();
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

      if (whereParams) {
        const filteredFeatures = featureResults.features.filter((f) => {
          return globalIdsAsNumber.includes(f.attributes.OBJECTID);
        });
        const filterWhereClause =
          "OBJECTID IN (" + globalIdsAsNumber.join(",") + ")";
        const featureFilter = new FeatureFilter({
          where: filterWhereClause,
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

    console.log("featureResults", featureResults);

    setLoading(false);
    return setData(featureResults.features);
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
                      item.attributes.LO_VEIKLA === obj.attributes.LO_VEIKLA
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
                const category = CategoryData.find(
                  (category) => feature.attributes.LO_VEIKLA === category.value
                );

                if (category && index < points.length) {
                  console.log("poitn", points);
                  const point = points[index];
                  const pointUrl = category.url;

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
              const category = CategoryData.find(
                (category) =>
                  //@ts-ignore
                  results[0].graphic.attributes.LO_VEIKLA === category.value
              );

              const pointUrl = category?.url;

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

  const handleFilter = useCallback((category: string[]) => {
    setCategory(category);
  }, []);

  useEffect(() => {
    if (!searchTerm) return setFilteredData(data);

    const filterData = data.filter((item) => {
      return item.attributes.PAVADIN.toLowerCase().includes(
        searchTerm.toLowerCase()
      );
    });
    return setFilteredData(filterData);
  }, [searchTerm, data]);

  return (
    <Stack direction="row" gap="0">
      <Flex
        maxW="550px"
        w="100%"
        flexDirection="column"
        position="relative"
        px="3"
        gap="2"
      >
        {/* <Search
          handleSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        /> */}
        <GroupTabs />
        <Flex direction="row" alignItems="center">
          <Filter handleFilter={handleFilter} />
          <Box w="100%" textAlign="right" fontSize="sm">
            Rodomos {!loading ? filteredData.length : "..."} veiklos
          </Box>
        </Flex>
        {category.length > 0 && <AppliedFilters category={category} />}
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
          h="calc(100vh - 180px)"
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
      </Flex>
      <Box position="relative" w="100%" h="calc(100vh - 64px)" bg="brand.10">
        <ArcGISMap />
        {auth.user.token && <Form auth={auth.user.token} view={view} />}
      </Box>
    </Stack>
  );
}
