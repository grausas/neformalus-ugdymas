import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import Basemap from "@arcgis/core/Basemap.js";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";
import Search from "@arcgis/core/widgets/Search.js";
import Zoom from "@arcgis/core/widgets/Zoom.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import Home from "@arcgis/core/widgets/Home.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import { featureLayerPublic } from "@/layers";

interface MapApp {
  view?: MapView;
}

const app: MapApp = {};

export function init(container: HTMLDivElement, layer: __esri.FeatureLayer) {
  if (app.view) {
    app.view.destroy();
  }

  const baseMap = new Basemap({
    baseLayers: [
      new VectorTileLayer({
        portalItem: {
          // sviesus
          id: "34adce6f797846bf8e971f402a251403",
          // tamsus
          // id: "e52404960466403b8f8ddc935e6d1e0d",
        },
      }),
    ],
    title: "basemap",
    id: "basemap",
  });

  const orto2022 = new Basemap({
    portalItem: {
      id: "f089d2cf232643819a0faacc679f2c4b",
    },
    title: "orto2022",
    id: "orto2022",
  });

  const map = new ArcGISMap({
    basemap: baseMap,
    layers: [layer],
  });

  const view = new MapView({
    map,
    container,
    center: [25.28093, 54.681],
    zoom: 13,
    ui: {
      components: ["attribution"],
    },
    constraints: {
      maxZoom: 20,
      minZoom: 10,
      snapToZoom: false,
    },
  });

  console.log("layer", layer);

  layer.featureReduction = {
    type: "cluster",
    clusterRadius: 60,
    clusterMinSize: 16,
    clusterMaxSize: 24,
    popupEnabled: false,
    symbol: {
      type: "simple-marker",
      // @ts-ignore
      color: "#ff8e3c",
      outline: {
        color: "#f15a24",
        width: 1, // points
      },
    },
    labelingInfo: [
      {
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,###')",
        },
        deconflictionStrategy: "none",
        labelPlacement: "center-center",
        symbol: {
          type: "text",
          // @ts-ignore
          color: "#272343",

          // @ts-ignore
          font: {
            family: "Noto Sans",
            size: 12,
          },
        },
      },
    ],
  };

  const marker = new SimpleMarkerSymbol({ color: [222, 222, 152, 0.93] });

  const sources = [
    {
      url: "https://gis.vplanas.lt/arcgis/rest/services/Lokatoriai/PAIESKA_COMPOSITE/GeocodeServer",
      singleLineFieldName: "SingleLine",
      name: "Vplanas paieska",
      placeholder: "Ieškoti adreso arba vietovės",
      maxResults: 3,
      maxSuggestions: 6,
      minSuggestCharacters: 0,
      resultSymbol: marker,
    },

    {
      layer: featureLayerPublic(),
      searchFields: ["PAVADIN"],
      displayField: "PAVADIN",
      exactMatch: false,
      outFields: ["*"],
      name: "Ieškoti veiklos",
      placeholder: "Ieškoti veiklos",
      maxResults: 6,
      maxSuggestions: 6,
      suggestionsEnabled: true,
      minSuggestCharacters: 0,
      zoomScale: 500,
      resultSymbol: marker,
    },
  ];

  const searchWidget = new Search({
    view: view,
    includeDefaultSources: false,
    allPlaceholder: "Ieškoti vietovės, veiklos",
    sources: sources,
    popupEnabled: false,
    id: "search",
  });

  const searchExpand = new Expand({
    view,
    content: searchWidget,
    expandTooltip: "Paieška",
  });

  view.ui.add(searchExpand, {
    position: "top-left",
    index: 2,
  });

  const legend = new Legend({
    view: view,
    label: "Kategorijos",
  });

  const legendExpand = new Expand({
    view,
    content: legend,
    expandTooltip: "Legenda",
  });

  view.ui.add(legendExpand, "top-left");
  const home = new Home({
    view: view,
  });

  view.ui.add(home, {
    position: "bottom-right",
  });

  const zoom = new Zoom({
    view: view,
  });

  view.ui.add(zoom, {
    position: "bottom-right",
  });

  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: orto2022,
  });
  view.ui.add(basemapToggle, "bottom-left");

  return view;
}
