import React, { useEffect, useState, useContext, useCallback } from "react";
import ArcGISMap from "@/components/Map";
import { Box, Spinner, Flex, Stack, AbsoluteCenter } from "@chakra-ui/react";
import Card from "@/components/Card";
import Filter from "@/components/Filter";
import NoResults from "@/components/NoResults";
import Form from "@/components/admin/Form";
import { featureLayerPublic } from "@/layers";
import Handles from "@arcgis/core/core/Handles.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter.js";
import { MapContext } from "@/context/map-context";
import { AuthContext } from "@/context/auth";
import { featureLayerFeatures } from "@/utils/featureLayer";
import { whereParamsChange } from "@/helpers/whereParams";

const defaultWhereParams = "1=1";

export default function Map() {
  const { view } = useContext(MapContext);
  const auth = useContext(AuthContext);
  const [data, setData] = useState<__esri.Graphic[]>([]);
  const [loading, setLoading] = useState(true);
  const [whereParams, setWhereParams] = useState(defaultWhereParams);
  const [category, setCategory] = useState<string[]>([]);

  useEffect(() => {
    setWhereParams(whereParamsChange(category));
  }, [category]);

  const queryFeatures = async (layerView: __esri.FeatureLayerView) => {
    const layer = featureLayerPublic();
    setLoading(true);

    const featureResults = await layer.queryFeatures({
      returnGeometry: true,
      geometry: view?.extent,
      outFields: featureLayerFeatures,
    });
    const objectIds = featureResults.features.map((f) => f.attributes.OBJECTID);

    if (featureResults.features.length > 0) {
      const relatedGlobalIds = await layer.queryRelatedFeatures({
        outFields: ["GUID"],
        relationshipId: layer.relationships[0].id,
        objectIds: objectIds,
        where: whereParams,
      });
      const globalIds = Object.keys(relatedGlobalIds);
      const globalIdsAsNumber = globalIds.map((gid) => {
        return parseInt(gid);
      });

      const filteredFeatures = featureResults.features.filter((f) => {
        return globalIdsAsNumber.includes(f.attributes.OBJECTID);
      });

      const featureFilter = new FeatureFilter({
        objectIds: globalIdsAsNumber.length === 0 ? [0] : globalIdsAsNumber,
      });
      layerView.filter = featureFilter;

      featureResults.features = filteredFeatures;
      if (globalIdsAsNumber.length > 0) {
        const relatedFeatures = await layer.queryRelatedFeatures({
          outFields: ["*"],
          relationshipId: layer.relationships[0].id,
          objectIds: globalIdsAsNumber,
        });

        globalIdsAsNumber.forEach(function (objectId) {
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

    setLoading(false);
    return setData(featureResults.features);
  };

  useEffect(() => {
    const handles = new Handles();
    if (!view) return;
    const layer = view?.map.layers.getItemAt(0) as __esri.FeatureLayer;

    view?.whenLayerView(layer).then(async (layerView) => {
      await queryFeatures(layerView);

      // subsequent map interaction
      handles.add(
        reactiveUtils.watch(
          () => [view.stationary, view.extent],
          ([stationary]) => {
            if (stationary) {
              promiseUtils.debounce(queryFeatures(layerView));
            }
          }
        )
      );
    });

    return () => handles.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, whereParams]);

  const handleFilter = useCallback((category: string[]) => {
    setCategory(category);
  }, []);

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
        <Filter handleFilter={handleFilter} />
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
        {auth.user.token && <Form auth={auth.user.token} view={view} />}
      </Box>
    </Stack>
  );
}
