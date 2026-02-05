import api from "@/shared/api/api";

export async function fetchItems() {
  const { data } = await api.get("/items");
  return data?.data ?? data ?? [];
}

export async function fetchItem(id: string) {
  const { data } = await api.get(`/items/${id}`);
  return data;
}

export async function createItem(payload: FormData) {
  return api.post("/items", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateItem(id: string, payload: FormData) {
  return api.post(`/items/${id}?_method=PUT`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteItem(id: string) {
  return api.delete(`/items/${id}`);
}
