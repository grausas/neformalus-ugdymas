import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import ArcGISMap from "@/components/Map";
import {
  Box,
  Spinner,
  Flex,
  Stack,
  AbsoluteCenter,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "@/components/Card";
import Filter from "@/components/Filter";
import AppliedFilters from "@/components/AppliedFilters";
import Search from "@/components/Search";
import NoResults from "@/components/NoResults";
import Form from "@/components/admin/Form";
import CardModal from "@/components/Modal";
import { featureLayerPublic } from "@/layers";
import Handles from "@arcgis/core/core/Handles.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter.js";
import { MapContext } from "@/context/map-context";
import { AuthContext } from "@/context/auth";
import { featureLayerFeatures } from "@/utils/featureLayer";
import { whereParamsChange } from "@/helpers/whereParams";
import { simpleRenderer } from "@/helpers/layerRenderer";

const defaultWhereParams = "1=1";

export default function Map() {
  const { view } = useContext(MapContext);
  const auth = useContext(AuthContext);
  const [data, setData] = useState<__esri.Graphic[]>([]);
  const [loading, setLoading] = useState(true);
  const [whereParams, setWhereParams] = useState(defaultWhereParams);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [modalData, setModalData] = useState<__esri.Graphic>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setWhereParams(whereParamsChange(category));
  }, [category]);

  console.log("whereParams324234234234", whereParams);

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

      if (whereParams) {
        console.log("whereParams", whereParams);
        console.log("herere");
        const filteredFeatures = featureResults.features.filter((f) => {
          return globalIdsAsNumber.includes(f.attributes.OBJECTID);
        });
        const featureFilter = new FeatureFilter({
          objectIds: globalIdsAsNumber.length === 0 ? [0] : globalIdsAsNumber,
        });
        layerView.filter = featureFilter;

        featureResults.features = filteredFeatures;
      } else {
        const featureFilter = new FeatureFilter({});
        layerView.filter = featureFilter;
      }

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
    // layer.renderer = simpleRenderer("{B367C74C-53E1-42EB-B0BE-019F56DE2370}");
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

  // filter features on map click
  // useEffect(() => {
  //   if (view) {
  //     view.on("click", async (event) => {
  //       const response = await view.hitTest(event);
  //       if (response.results.length) {
  //         const results = response.results?.filter(
  //           (hitResult) =>
  //             hitResult.type === "graphic" &&
  //             hitResult.graphic.layer.id === "public"
  //         );
  //         // const results = response.results;
  //         const filteredData = data.filter((g) => {
  //           return results
  //             ?.map((r) => r.graphic.attributes.OBJECTID)
  //             .includes(g.attributes.OBJECTID);
  //         });
  //         setData(filteredData);
  //       }
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [view]);

  const handleFilter = useCallback((category: string[]) => {
    setCategory(category);
  }, []);

  const handleOpenModal = (data: __esri.Graphic) => {
    console.log("data", data);
    setModalData(data);
    onOpen();
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const filterData = data.filter((item) => {
      return item.attributes.PAVADIN.toLowerCase().includes(
        searchTerm.toLowerCase()
      );
    });
    return filterData;
  }, [searchTerm, data]);

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
        {modalData && (
          <CardModal isOpen={isOpen} onClose={onClose} modalData={modalData} />
        )}
        <Search
          handleSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
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
              color="brand.30"
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
              background: "#ff8e3c",
              borderRadius: "24px",
            },
          }}
        >
          {!loading &&
            filteredData.length > 0 &&
            filteredData.map((item) => (
              <Card
                key={item.attributes.OBJECTID}
                cardData={item}
                handleOpenModal={handleOpenModal}
              />
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
