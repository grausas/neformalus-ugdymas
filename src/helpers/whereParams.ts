export const whereParamsChange = (
  activity: string[],
  group: number,
  nvs?: number
) => {
  const params: string[] = [];
  if (group) params.push(`VEIKLAGRID = ${group}`);
  if (activity.length) params.push(`VEIKLAID IN (${activity.join(",")})`);
  if (nvs) params.push(`NVS_KREPSE = ${nvs}`);
  return params.join(" AND ");
};
