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
    setLoading(true);
    featureLayerPublic()
      .queryFeatures({
        returnGeometry: true,
        geometry: view?.extent,
        outFields: featureLayerFeatures,
      })
      .then(function (results) {
        console.log("results", results);
        setLoading(false);
        // prints the array of result graphics to the console
        return setData(results.features);
      });
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
    <Stack direction="row">
      <Flex minW="500px" flexDirection="column" position="relative" p="4">
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
          data.map((item) => (
            <Text key={item.attributes.OBJECTID}>
              {item.attributes.PAVADIN}
            </Text>
          ))}
      </Flex>
      <Box position="relative" w="100%" h="calc(100vh - 64px)">
        <ArcGISMap />
      </Box>
    </Stack>
  );
}
