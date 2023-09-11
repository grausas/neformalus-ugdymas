"use client";

import { useContext, useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { MapContext } from "../../context/map-context";
import { AuthContext } from "@/context/auth";
import { featureLayerPublic, featureLayerPrivate } from "../../layers";

const ArcGISMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { loadMap } = useContext(MapContext);
  const auth = useContext(AuthContext);
  const layer = auth.user.token ? featureLayerPrivate() : featureLayerPublic();

  useEffect(() => {
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
      overflow="hidden"
      ref={mapRef}
    ></Box>
  );
};

export default ArcGISMap;
