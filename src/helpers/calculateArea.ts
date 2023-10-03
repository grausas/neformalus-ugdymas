import Graphic from "@arcgis/core/Graphic";
import * as geoprocessor from "@arcgis/core/rest/geoprocessor.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";

const serviceAreaUrl =
  "https://opencity.vplanas.lt/server/rest/services/Routing/NetworkAnalysis/GPServer/GenerateServiceAreas";
let graphicLayer: GraphicsLayer;
export const calculateArea = (view: __esri.MapView) => {
  view?.on("click", async function (event) {
    view.map.layers.remove(graphicLayer);
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

  // Create the location graphic
  function createGraphic(point) {
    view?.graphics.removeAll();
    const graphic = new Graphic({
      geometry: point,
      symbol: {
        type: "simple-marker",
        color: "white",
        size: 8,
      },
    });

    view?.graphics.add(graphic);
    return graphic;
  }

  function solveServiceArea(url, serviceAreaParams) {
    console.log("serviceAreaParams", serviceAreaParams);
    geoprocessor.submitJob(url, serviceAreaParams).then((jobInfo) => {
      console.log("jobInfo", jobInfo);
      const jobid = jobInfo.jobId;
      console.log("ArcGIS Server job ID: ", jobid);

      const options = {
        interval: 1500,
        statusCallback: (j) => {
          console.log("Job Status: ", j.jobStatus);
        },
      };

      jobInfo.waitForJobCompletion().then(async () => {
        const layer = await jobInfo.fetchResultData("Service_Areas");
        console.log("layer", layer);
        if (layer.value.features.length) {
          const graphics: Graphic[] = [];
          // Draw each service area polygon
          layer.value.features.forEach(function (graphic) {
            graphic.symbol = {
              type: "simple-fill",
              color: "rgba(255,50,50,.25)",
            };
            graphics.push(graphic);
            // view?.graphics.add(graphic, 0);
          });
          console.log("graphics", graphics);
          graphicLayer = new GraphicsLayer({
            id: "Service_Areas",
            graphics: graphics,
          });
          view.map.add(graphicLayer);
        }
      });
    });
  }
};
