import { useContext, useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { MapContext } from "../../context/map-context";
import { featureLayerForRenderer } from "../../layers";
import { simpleRenderer } from "@/helpers/layerRenderer";

const ArcGISMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { loadMap } = useContext(MapContext);
  const layer = featureLayerForRenderer(simpleRenderer);

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
