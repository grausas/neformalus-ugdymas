"use client";

import { useContext, useLayoutEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { MapContext } from "../../context/map-context";
import { featureLayerPublic } from "../../layers";

const ArcGISMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { loadMap } = useContext(MapContext);
  const layer = featureLayerPublic();

  useLayoutEffect(() => {
    if (mapRef.current && loadMap) {
      loadMap(mapRef.current, layer);
    }
  }, [mapRef, loadMap, layer]);

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      w="100%"
      h="100%"
      ref={mapRef}
    ></Box>
  );
};

export default ArcGISMap;
