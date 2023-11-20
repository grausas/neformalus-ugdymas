import { featureLayerPrivate, featureLayerPrivateTable } from "@/layers";
import Graphic from "@arcgis/core/Graphic";
import { FormValues, FormRelated } from "@/types/form";

export const AddFeature = async (
  attributes: FormValues,
  geometry: __esri.Geometry,
  relatedAttributes?: FormRelated
): Promise<string> => {
  if (attributes.TELEF_MOB) {
    attributes.TELEF_MOB = `+370${attributes.TELEF_MOB}`;
  }

  const addFeature = new Graphic({ attributes, geometry });
  const addRelatedFeatures = createRelatedFeatures(relatedAttributes);

  try {
    const primaryResponse = await featureLayerPrivate().applyEdits({
      addFeatures: [addFeature],
    });

    if (primaryResponse) {
      const globalId = primaryResponse.addFeatureResults[0].globalId;
      await addRelatedData(globalId, addRelatedFeatures);
      return "success";
    }
  } catch (error) {
    return "error";
  }

  return "error";
};

const createRelatedFeatures = (relatedAttributes?: FormRelated): Graphic[] => {
  const relatedGraphics: Graphic[] = [];

  if (!relatedAttributes) {
    return relatedGraphics;
  }

  if (relatedAttributes.VEIKLAID && relatedAttributes.VEIKLAID.length > 0) {
    relatedAttributes.VEIKLAID.forEach((activityNumber) => {
      const graphic = new Graphic();
      graphic.attributes = Object.assign({}, relatedAttributes);
      graphic.attributes.VEIKLAID = activityNumber;
      relatedGraphics.push(graphic);
    });
  } else {
    relatedGraphics.push(new Graphic({ attributes: relatedAttributes }));
  }

  return relatedGraphics;
};

const addRelatedData = async (
  globalId: string,
  addRelatedFeatures: Graphic[]
): Promise<void> => {
  addRelatedFeatures.forEach((feature) => {
    feature.attributes.GUID = globalId;
  });

  try {
    await featureLayerPrivateTable().applyEdits({
      addFeatures: addRelatedFeatures,
    });
  } catch (error) {
    throw new Error("Error adding related data");
  }
};
