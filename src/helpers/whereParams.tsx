export const whereParamsChange = (category: string[], group: number) => {
  const params: string[] = [];
  if (group) params.push(`VEIKLAGRID = ${group}`);
  if (category.length) params.push(`LO_VEIKLA IN (${category.join(",")})`);
  return params.join(" AND ");
};
