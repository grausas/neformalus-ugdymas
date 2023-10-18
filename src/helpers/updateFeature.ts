import { DeleteFeature } from "@/helpers/deleteFeature";
import { featureLayerPrivate, featureLayerPrivateTable } from "@/layers";
import Graphic from "@arcgis/core/Graphic";
import { FormValues, FormRelated } from "@/types/form";

export const UpdateFeature = async (
  attributes: FormValues,
  //   geometry: __esri.Geometry,
  relatedAttributes?: FormRelated,
  deleteVeiklaIds?: number[]
) => {
  const updateFeature = new Graphic({
    attributes,
    // geometry,
  });

  const updateRelatedFeatures: Graphic[] = [];

  if (relatedAttributes?.VEIKLAID && relatedAttributes.VEIKLAID.length > 0) {
    const itemToAdd = { ...relatedAttributes };
    delete itemToAdd.OBJECTID;
    relatedAttributes?.VEIKLAID.map((item: number) => {
      const activityNumber = item;
      // @ts-ignore
      itemToAdd.VEIKLAID = activityNumber;
      updateRelatedFeatures.push(
        new Graphic({
          attributes: {
            ...itemToAdd,
          },
        })
      );
    });
  } else {
    updateRelatedFeatures.push(
      new Graphic({
        attributes: relatedAttributes,
      })
    );
  }

  const edits = {
    updateFeatures: [updateFeature],
  };

  const relatedEdits = {
    addFeatures: updateRelatedFeatures,
  };

  const deleteVeiklas = {
    deleteFeatures: deleteVeiklaIds?.map((item) => {
      return { objectId: item };
    }),
  };

  let results;

  const addRelatedData = async () => {
    relatedEdits.addFeatures.forEach((item) => {
      item.attributes.GUID = attributes.GlobalID;
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

  const deleteVeikla = async () => {
    await featureLayerPrivateTable()
      .applyEdits(deleteVeiklas)
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
        await deleteVeikla();
        await addRelatedData();
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
