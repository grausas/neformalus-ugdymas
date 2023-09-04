import React, { useEffect, useState, useContext } from "react";
import ArcGISMap from "@/components/Map";
import {
  Box,
  Spinner,
  Text,
  Flex,
  Stack,
  AbsoluteCenter,
} from "@chakra-ui/react";
import Card from "@/components/Card";
import NoResults from "@/components/NoResults";
import { featureLayerPublic } from "@/layers";
import Handles from "@arcgis/core/core/Handles.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";
import { MapContext } from "@/context/map-context";
import { featureLayerFeatures } from "@/utils/featureLayer";

export default function Map() {
  const { view } = useContext(MapContext);

  const [data, setData] = useState<__esri.Graphic[]>([]);
  const [loading, setLoading] = useState(true);

  const queryFeatures = async () => {
    const layer = featureLayerPublic();
    setLoading(true);

    const featureResults = await layer.queryFeatures({
      returnGeometry: true,
      geometry: view?.extent,
      outFields: featureLayerFeatures,
    });

    const objectIds = featureResults.features.map((f) => f.attributes.OBJECTID);

    if (featureResults.features.length > 0) {
      const relatedFeatures = await layer.queryRelatedFeatures({
        outFields: ["*"],
        relationshipId: layer.relationships[0].id,
        objectIds: objectIds,
      });
      objectIds.forEach(function (objectId) {
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

    setLoading(false);
    return setData(featureResults.features);
  };

  useEffect(() => {
    const handles = new Handles();
    if (!view) return;
    const layer = view?.map.layers.getItemAt(0) as __esri.FeatureLayer;

    view?.whenLayerView(layer).then(async () => {
      await queryFeatures();

      // subsequent map interaction
      handles.add(
        reactiveUtils.watch(
          () => [view.stationary, view.extent],
          ([stationary]) => {
            if (stationary) {
              promiseUtils.debounce(queryFeatures());
            }
          }
        )
      );
    });

    return () => handles.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  return (
    <Stack direction="row" gap="0">
      <Flex
        maxW="600px"
        w="100%"
        flexDirection="column"
        position="relative"
        p="3"
        gap="3"
      >
        {loading && (
          <AbsoluteCenter axis="both">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="brand.10"
              size="xl"
              color="brand.30"
            />
          </AbsoluteCenter>
        )}
        {!loading &&
          data.length > 0 &&
          data.map((item) => (
            <Card key={item.attributes.OBJECTID} cardData={item} />
          ))}
        {!loading && data.length === 0 && <NoResults />}
      </Flex>
      <Box position="relative" w="100%" h="calc(100vh - 64px)" bg="brand.20">
        <ArcGISMap />
      </Box>
    </Stack>
  );
}
