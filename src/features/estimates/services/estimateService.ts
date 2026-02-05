import api from "@/shared/api/api";

export const fetchCategories = async () => (await api.get("/categories")).data;
export const fetchUnits = async () => (await api.get("/units")).data;
export const fetchItemsByCategory = async (id: string) =>
  (await api.get(`/items?category_id=${id}`)).data?.data || [];

export const createEstimate = async (payload: any) =>
  (await api.post("/sales/estimates", payload)).data;

export const fetchEstimates = async () =>
  (await api.get("/sales/estimates")).data;

export const fetchEstimate = async (id: number) =>
  (await api.get(`/sales/estimates/${id}`)).data;

export const updateEstimate = async (id: number, payload: any) =>
  (await api.put(`/sales/estimates/${id}`, payload)).data;

export const deleteEstimate = async (id: number) =>
  (await api.delete(`/sales/estimates/${id}`)).data;

export const downloadEstimate = async (id: number) => {
  const res = await api.get(`/sales/estimates/${id}/download`, {
    responseType: "blob",
  });

  // Log headers for debugging
  console.log(res.headers);

  // Default filename
  let filename = `estimate-${id}.pdf`;

  // Check if backend provided Content-Disposition
  const disposition = res.headers["content-disposition"];
  if (disposition && disposition.includes("filename=")) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  // Create Blob and trigger download
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename; // use backend-provided filename if available
  link.click();

  // Clean up
  window.URL.revokeObjectURL(url);
};

