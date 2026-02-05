import api from "@/shared/api/api";

export const ENDPOINTS = {
  business: "/settings/business-profile",
  salesman: "/salesmen",
  cities: "/cities",
};

export const fetchBusiness = () => api.get(ENDPOINTS.business);
export const saveBusiness = (data: FormData) =>
  api.post(ENDPOINTS.business, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchCities = () => api.get(ENDPOINTS.cities);

export const fetchSalesmen = () => api.get(ENDPOINTS.salesman);
export const createSalesman = (data: any) => api.post(ENDPOINTS.salesman, data);
export const updateSalesman = (id: string | number, data: any) =>
  api.put(`${ENDPOINTS.salesman}/${id}`, data);
export const deleteSalesman = (id: string | number) =>
  api.delete(`${ENDPOINTS.salesman}/${id}`);
