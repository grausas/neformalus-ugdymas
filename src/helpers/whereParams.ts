export const whereParamsChange = (
  activity: string[],
  group: number,
  nvs?: number,
  classFilter?: { name?: string; value?: number }[]
) => {
  console.log("classFilterWhereParams", classFilter);
  const params: string[] = [];
  if (group) params.push(`VEIKLAGRID = ${group}`);
  if (activity.length) params.push(`VEIKLAID IN (${activity.join(",")})`);
  if (nvs) params.push(`NVS_KREPSE = ${nvs}`);
  if (classFilter) {
    classFilter.forEach((item) => {
      if (item.name && item.value) {
        params.push(`${item.name} = ${item.value}`);
      }
    });
  }
  return params.join(" AND ");
};
