import { featureLayerPrivate, featureLayerPrivateTable } from "@/layers";
import Graphic from "@arcgis/core/Graphic";
import { FormValues, FormRelated } from "@/types/form";

export const AddFeature = async (
  attributes: FormValues,
  geometry: __esri.Geometry,
  relatedAttributes?: FormRelated
) => {
  const addFeature = new Graphic({
    attributes,
    geometry,
  });

  if (attributes.TELEF_MOB) {
    attributes.TELEF_MOB = `+370${attributes.TELEF_MOB}`;
  }

  const addRelatedFeatures: Graphic[] = [];

  // const addRelatedFeatures = new Graphic({
  //   attributes: relatedAttributes,
  // });

  if (relatedAttributes?.VEIKLAID && relatedAttributes.VEIKLAID.length > 0) {
    const itemToAdd = { ...relatedAttributes };
    relatedAttributes?.VEIKLAID.map((item: number) => {
      const activityNumber = item;
      // @ts-ignore
      itemToAdd.VEIKLAID = activityNumber;
      addRelatedFeatures.push(
        new Graphic({
          attributes: {
            ...itemToAdd,
          },
        })
      );
    });
  } else {
    addRelatedFeatures.push(
      new Graphic({
        attributes: relatedAttributes,
      })
    );
  }

  const edits = {
    addFeatures: [addFeature],
  };

  const relatedEdits = {
    addFeatures: addRelatedFeatures,
  };

  let results;

  const addRelatedData = async (globalId: string) => {
    relatedEdits.addFeatures.forEach((item) => {
      item.attributes.GUID = globalId;
    });
    await featureLayerPrivateTable()
      .applyEdits(relatedEdits)
      .then((response) => {
        if (response) {
          results = "success";
        }
      })
      .catch((error) => {
        if (error) {
          results = "error";
        }
      });
  };

  await featureLayerPrivate()
    .applyEdits(edits)
    .then(async (response) => {
      if (response) {
        const globalId = response.addFeatureResults[0].globalId;
        await addRelatedData(globalId);
        results = "success";
      }
    })
    .catch((error) => {
      if (error) {
        results = "error";
      }
    });

  return results;
};
