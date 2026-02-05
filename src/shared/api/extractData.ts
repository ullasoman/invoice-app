export function extractData(res: any) {
  const data = res?.data?.data;
  return Array.isArray(data) ? data : data?.data ?? [];
}
