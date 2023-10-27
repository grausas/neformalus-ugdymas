import graphicLayer from "@arcgis/core/layers/GraphicsLayer.js";
export const gLayer = new graphicLayer({
  title: "graphics",
});

export const drawPoints = async (view: __esri.MapView | undefined) => {
  view?.map.layers.add(gLayer);
  const sketch = await (await import("@arcgis/core/widgets/Sketch.js")).default;
  const sketchViewModel = await (
    await import("@arcgis/core/widgets/Sketch/SketchViewModel")
  ).default;

  const sketchModel = new sketchViewModel({
    view: view,
    layer: gLayer,
    pointSymbol: {
      type: "simple-marker",
      style: "circle",
      color: "#f15a24",
      size: "14px",
      outline: {
        width: 1,
        style: "solid",
        color: "#808080",
      },
    },
  });

  const home = new sketch({
    view: view,
    layer: gLayer,
    visibleElements: {
      createTools: {
        circle: false,
        polyline: false,
        rectangle: false,
        polygon: false,
      },
      selectionTools: {
        "lasso-selection": false,
        "rectangle-selection": false,
      },
      settingsMenu: false,
    },
    defaultUpdateOptions: {
      tool: "reshape",
      toggleToolOnClick: false,
    },
  });

  home.viewModel = sketchModel;
  view?.ui.add(home, {
    position: "top-right",
  });

  return home;
};
