export const whereParamsChange = (activity: string[], group: number) => {
  const params: string[] = [];
  if (group) params.push(`VEIKLAGRID = ${group}`);
  if (activity.length) params.push(`VEIKLAID IN (${activity.join(",")})`);
  return params.join(" AND ");
};
