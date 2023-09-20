const symbol = (url: string, width: string, height: string) => ({
  type: "picture-marker",
  url,
  width,
  height,
});

const uniqueValueInfos = [
  { value: "1", symbol: symbol("sportas.svg", "23px", "23px") },
  { value: "2", symbol: symbol("technologijos.svg", "23px", "23px") },
  { value: "3", symbol: symbol("drama.svg", "23px", "23px") },
  { value: "4", symbol: symbol("kalbos.svg", "23px", "23px") },
  { value: "5", symbol: symbol("choreografija.svg", "23px", "23px") },
  { value: "6", symbol: symbol("daile.svg", "23px", "23px") },
  { value: "7", symbol: symbol("muzika.svg", "23px", "23px") },
  { value: "8", symbol: symbol("turizmas.svg", "23px", "23px") },
  { value: "9", symbol: symbol("etnokultura.svg", "23px", "23px") },
  { value: "10", symbol: symbol("gamta.svg", "23px", "23px") },
  { value: "11", symbol: symbol("technine_kuryba.png", "23px", "23px") },
  { value: "12", symbol: symbol("pilietiskumas.svg", "23px", "23px") },
  { value: "13", symbol: symbol("saugus_eismas.svg", "23px", "23px") },
  { value: "14", symbol: symbol("medijos.svg", "23px", "23px") },
];

export const simpleRenderer = {
  type: "unique-value",
  field: "LO_VEIKLA",
  uniqueValueInfos,
};
