import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
// category icons
import technologijos from "../assets/technologijos.svg";
import choreografija from "../assets/choreografija.svg";
import technineKuryba from "../assets/technine_kuryba.png";

const symbol = (url: string, width: string, height: string) => ({
  type: "picture-marker",
  url,
  width,
  height,
});

const uniqueValueInfos = [
  { value: "2", symbol: symbol("choreografija.svg", "23px", "23px") },
  { value: "3", symbol: symbol("technologijos.svg", "23px", "23px") },
];

const name = "$feature.OBJECTID";

export const simpleRenderer = {
  type: "unique-value",
  field: "OBJECTID",
  valueExpression: `When($feature.OBJECTID > 1, "3")`,
  uniqueValueInfos,
};

// export const layerRenderer = (view: any) => {
//   reactiveUtils
//     .whenOnce(() => view.ready)
//     .then(() => {
//       if (view.map.layers.length === 0) return;

//       // create unique render values with icons
//       const symbol = (url: string, width: string, height: string) => ({
//         type: "picture-marker",
//         url,
//         width,
//         height,
//       });

//       const uniqueValueInfos = [
//         { value: "2", symbol: symbol("technologijos.svg", "23px", "23px") },
//         // { value: "3", symbol: symbol(choreografija, "23px", "23px") },
//       ];

//       const uniqueValueInfosBig = uniqueValueInfos.map((info) => ({
//         ...info,
//         symbol: symbol(info.symbol.url, "30px", "30px"),
//       }));

//       const simpleRenderer = {
//         type: "unique-value",
//         field: "KATEGORIJA",
//         uniqueValueInfos,
//       };

//       //   change render symbol depending on zoom level
//       reactiveUtils.watch(
//         () => view.zoom,
//         () => {
//           view.map.layers.items[0].renderer = simpleRenderer;
//         },
//         {
//           initial: true,
//         }
//       );
//     });

//   return view;
// };
