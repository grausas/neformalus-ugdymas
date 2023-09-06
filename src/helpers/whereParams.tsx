export const whereParamsChange = (category: string[]): string => {
  const params: string[] = [];
  if (category.length) params.push(`LO_VEIKLA IN (${category.join(",")})`);
  return params.join(" AND ");
};
