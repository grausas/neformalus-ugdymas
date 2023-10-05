const symbol = (url: string, width: string, height: string) => ({
  type: "picture-marker",
  url,
  width,
  height,
});

const uniqueValueInfos = [
  {
    value: "1",
    label: "Sportas",
    symbol: symbol("sportas.svg", "23px", "23px"),
  },
  {
    value: "2",
    label: "Informacinės technologijos",
    symbol: symbol("technologijos.svg", "23px", "23px"),
  },
  {
    value: "3",
    label: "Teatras, drama",
    symbol: symbol("drama.svg", "23px", "23px"),
  },
  { value: "4", label: "Kalbos", symbol: symbol("kalbos.svg", "23px", "23px") },
  {
    value: "5",
    label: "Choreografija, šokis",
    symbol: symbol("choreografija.svg", "23px", "23px"),
  },
  { value: "6", label: "Dailė", symbol: symbol("daile.svg", "23px", "23px") },
  { value: "7", label: "Muzika", symbol: symbol("muzika.svg", "23px", "23px") },
  {
    value: "8",
    label: "Turizmas ir kraštotyra",
    symbol: symbol("turizmas.svg", "23px", "23px"),
  },
  {
    value: "9",
    label: "Etnokultūra",
    symbol: symbol("etnokultura.svg", "23px", "23px"),
  },
  {
    value: "10",
    label: "Gamta, ekologija",
    symbol: symbol("gamta.svg", "23px", "23px"),
  },
  {
    value: "11",
    label: "Techninė kūryba",
    symbol: symbol("technine_kuryba.png", "23px", "23px"),
  },
  {
    value: "12",
    label: "Pilietiškumas",
    symbol: symbol("pilietiskumas.svg", "23px", "23px"),
  },
  {
    value: "13",
    label: "Medijos",
    symbol: symbol("medijos.svg", "23px", "23px"),
  },
  {
    value: "14",
    label: "Technologijos",
    symbol: symbol("technologijos.svg", "23px", "23px"),
  },
  {
    value: "15",
    label: "Kitos veiklos",
    symbol: symbol("medijos.svg", "23px", "23px"),
  },
  {
    value: "16",
    label: "Saugus eismas",
    symbol: symbol("saugus_eismas.svg", "23px", "23px"),
  },
];

export const simpleRenderer = {
  type: "unique-value",
  defaultSymbol: symbol("medijos.svg", "23px", "23px"),
  field: "VEIKLAID",
  uniqueValueInfos,
};
