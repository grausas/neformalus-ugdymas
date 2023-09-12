import { featureLayerPrivate, featureLayerPrivateTable } from "@/layers";
import Graphic from "@arcgis/core/Graphic";
import { FormValues, FormRelated } from "@/types/form";

export const AddFeature = async (
  attributes: FormValues,
  geometry: __esri.Geometry,
  relatedAttributes: FormRelated
) => {
  const addFeature = new Graphic({
    attributes,
    geometry,
  });

  const addRelatedFeatures = new Graphic({
    attributes: relatedAttributes,
  });

  const edits = {
    addFeatures: [addFeature],
  };

  const relatedEdits = {
    addFeatures: [addRelatedFeatures],
  };

  console.log("relatedEdits", relatedEdits);

  let results;

  await featureLayerPrivateTable()
    .applyEdits(relatedEdits)
    .then((response) => {
      if (response) {
        console.log("resultsTable", response);
        results = "success";
      }
    })
    .catch((error) => {
      if (error) {
        console.log("resultsErrorTable", error);
        results = "error";
      }
    });

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
