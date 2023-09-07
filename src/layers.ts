"use client";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export const featureLayerPublic = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_Vaiku_ugdymas/Vaiku_ugdymas/MapServer/0",
    outFields: ["*"],
    title: "Jaunimo ugdymas",
    id: "public",
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
    effect: "drop-shadow(0px, 0px, 3px)",
  });
  return layer;
};

export const featureLayerPrivateTable = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_Vaiku_ugdymas/Vaiku_ugdymas_edit/FeatureServer/1",
    outFields: ["*"],
    title: "Jaunimo ugdymas",
    id: "private-table",
    effect: "drop-shadow(0px, 0px, 3px)",
  });
  return layer;
};
