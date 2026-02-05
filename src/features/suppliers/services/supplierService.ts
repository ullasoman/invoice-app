import api from "@/shared/api/api";

export async function fetchSuppliers() {
  const res = await api.get("/suppliers");
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
}

export async function fetchCities() {
  const res = await api.get("/cities");
  return res.data || [];
}

export async function createSupplier(data: any) {
  return api.post("/suppliers", data);
}

export async function updateSupplier(id: number, data: any) {
  return api.put(`/suppliers/${id}`, data);
}

export async function deleteSupplier(id: number) {
  return api.delete(`/suppliers/${id}`);
}
