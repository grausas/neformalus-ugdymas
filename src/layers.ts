import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export const featureLayerPublic = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_Vaiku_ugdymas/Vaiku_ugdymas/MapServer/0",
    outFields: ["*"],
    title: "Jaunimo ugdymas",
    id: "public",
    effect: "drop-shadow(0px, 0px, 3px)",
    visible: false,
  });
  return layer;
};

export const featureLayerPublicTable = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_Vaiku_ugdymas/Vaiku_ugdymas/MapServer/4",
    outFields: ["*"],
    title: "Jaunimo ugdymas",
    id: "public-table",
    effect: "drop-shadow(0px, 0px, 3px)",
  });
  return layer;
};

export const featureLayerPrivate = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_Vaiku_ugdymas/Vaiku_ugdymas_edit/FeatureServer/0",
    outFields: ["*"],
    title: "Jaunimo ugdymas",
    id: "private",
  });
  return layer;
};

export const featureLayerPrivateTable = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_Vaiku_ugdymas/Vaiku_ugdymas_edit/FeatureServer/2",
    outFields: ["*"],
    title: "Jaunimo ugdymas",
    id: "private-table",
  });
  return layer;
};

export const featureLayerForRenderer = (renderer: any) => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_Vaiku_ugdymas/Vaiku_ugdymas/MapServer/2",
    outFields: ["*"],
    title: "Jaunimo ugdymas",
    id: "renderer",
    effect: "drop-shadow(0px, 0px, 3px)",
    renderer,
  });
  return layer;
};

export const featureLayerActivityGroupTable = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_Vaiku_ugdymas/Vaiku_ugdymas/MapServer/6",
    outFields: ["*"],
    title: "Jaunimo ugdymas",
    id: "activity-group-table",
  });
  return layer;
};
