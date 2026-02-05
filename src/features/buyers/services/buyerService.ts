import api from "@/shared/api/api";

export async function getBuyers() {
  const res = await api.get("/buyers");
  return res.data;
}

export async function createBuyer(payload: any) {
  const res = await api.post("/buyers", payload);
  return res.data;
}

export async function updateBuyer(id: number, payload: any) {
  const res = await api.put(`/buyers/${id}`, payload);
  return res.data;
}

export async function deleteBuyer(id: number) {
  const res = await api.delete(`/buyers/${id}`);
  return res.data;
}
