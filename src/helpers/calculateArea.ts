import Graphic from "@arcgis/core/Graphic";
import * as geoprocessor from "@arcgis/core/rest/geoprocessor.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";

const serviceAreaUrl =
  "https://opencity.vplanas.lt/server/rest/services/Routing/NetworkAnalysis/GPServer/GenerateServiceAreas";

const graphicLayer = new GraphicsLayer({
  id: "Service_Areas",
});
let handler: any;

export const calculateArea = (view: __esri.MapView, areaStatus: boolean) => {
  console.log("areaStatus", areaStatus);
  if (areaStatus) {
    if (handler) {
      return;
    }
    handler = view?.on("click", async function (event) {
      graphicLayer.removeAll();
      const locationGraphic = createGraphic(event.mapPoint);

      const params = {
        Facilities: {
          features: [locationGraphic],
        },
        Impedance: "WalkTime",
        Time_Impedance: "WalkTime",
      };

      await solveServiceArea(serviceAreaUrl, params);

      console.log("vieLAyer", view.map);
    });
  } else {
    handler?.remove();
    graphicLayer.removeAll();
    handler = null;
  }

  // Create the location graphic
  function createGraphic(point: __esri.Point) {
    view?.graphics.removeAll();
    const graphic = new Graphic({
      geometry: point,
      symbol: {
        // @ts-ignore
        type: "picture-marker",
        url: "/location.svg",
        width: "23px",
        height: "23px",
      },
    });

    graphicLayer.add(graphic);
    view.map.add(graphicLayer);

    return graphic;
  }

  async function solveServiceArea(
    url: string,
    serviceAreaParams: {
      Facilities: { features: Graphic[] };
      Impedance: string;
      Time_Impedance: string;
    }
  ) {
    const graphics: Graphic[] = [];

    console.log("serviceAreaParams", serviceAreaParams);
    await geoprocessor.submitJob(url, serviceAreaParams).then((jobInfo) => {
      console.log("jobInfo", jobInfo);
      const jobid = jobInfo.jobId;
      console.log("ArcGIS Server job ID: ", jobid);

      const options = {
        interval: 1500,
        statusCallback: (j: any) => {
          console.log("Job Status: ", j.jobStatus);
        },
      };

      // reikai pridėti loading kol skaičiuoja service area

      jobInfo.waitForJobCompletion().then(async () => {
        const layer = await jobInfo.fetchResultData("Service_Areas");
        console.log("layer", layer);
        // @ts-ignore
        if (layer.value.features.length) {
          // @ts-ignore
          layer.value.features.forEach(function (
            feature: __esri.Graphic,
            index: number
          ) {
            console.log("features", feature);
            const colors = [
              "rgba(177,211,50,.25)",
              "rgba(177,211,50,.5)",
              "rgba(177,211,50,.75)",
            ];
            feature.symbol = {
              type: "simple-fill",
              // @ts-ignore
              color: colors[index],
              outline: {
                // @ts-ignore
                color: "#ffffff",
              },
            };
            graphics.push(feature);
            // view?.graphics.add(graphic, 0);
          });
          await graphicLayer.addMany(graphics);
          const pointGraphic = graphicLayer.graphics.shift();
          graphicLayer.graphics.push(pointGraphic);
          console.log("graphicLayer", graphicLayer);
        }
      });
    });
  }
};
