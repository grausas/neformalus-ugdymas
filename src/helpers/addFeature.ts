import { featureLayerPrivate } from "@/layers";
import Graphic from "@arcgis/core/Graphic";
import { FormValues } from "@/types/form";

export const AddFeature = async (feature: FormValues) => {
  const addFeature = new Graphic({
    attributes: feature,
  });

  const edits = {
    addFeatures: [addFeature],
  };

  let results;

  await featureLayerPrivate()
    .applyEdits(edits)
    .then((response) => {
      if (response) {
        console.log("results", response);
        results = "success";
      }
    })
    .catch((error) => {
      if (error) {
        console.log("resultsError", error);
        results = "error";
      }
    });

  return results;
};
