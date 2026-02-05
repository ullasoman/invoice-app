import api from "@/shared/api/api";
import { PaginatedResponse } from "@/shared/api/pagination";
import { Category } from "@/types";

export const fetchCategories = async (
  page = 1,
  perPage = 10
): Promise<PaginatedResponse<Category>> => {
  const res = await api.get(`/categories?page=${page}&per_page=${perPage}`);
  return res.data;
};

export const createCategory = async (data: Partial<Category>) => {
  return api.post("/categories", data);
};

export const updateCategory = async (id: number, data: Partial<Category>) => {
  return api.put(`/categories/${id}`, data);
};

export const deleteCategory = async (id: number) => {
  return api.delete(`/categories/${id}`);
};
