import { featureLayerActivityGroupTable } from "./../layers";
const queryDomainsUrl =
  "https://opencity.vplanas.lt/arcgis/rest/services/P_Vaiku_ugdymas/Vaiku_ugdymas/MapServer/1?f=pjson";

export const queryDomains = async () => {
  const res = await fetch(queryDomainsUrl)
    .then((response) => response.json())
    .then((data) => data);

  const filteredDomains = res.fields.filter((field: any) => {
    if (!field.domain) return;
    if (!field.domain.codedValues) return;
    return field;
  });

  return filteredDomains;
};

export const queryActivityGroupTable = async () => {
  const featureResults = await featureLayerActivityGroupTable().queryFeatures({
    returnGeometry: true,
    outFields: ["*"],
    where: "1=1",
  });

  return featureResults.features;
};
