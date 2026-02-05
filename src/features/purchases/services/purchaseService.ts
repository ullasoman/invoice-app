import api from "@/shared/api/api";

export async function fetchPurchases(params?: Record<string, any>) {
  const res = await api.get("/purchases", { params });
  return res.data?.data || res.data || [];
}

export async function fetchPurchase(id: number | string) {
  const res = await api.get(`/purchases/${id}`);
  return res.data;
}

export async function createPurchase(payload: any) {
  const res = await api.post("/purchases", payload);
  return res.data;
}

export async function updatePurchase(id: number | string, payload: any) {
  const res = await api.put(`/purchases/${id}`, payload);
  return res.data;
}

export async function deletePurchase(id: number | string) {
  const res = await api.delete(`/purchases/${id}`);
  return res.data;
}
