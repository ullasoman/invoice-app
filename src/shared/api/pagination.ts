export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export const buildPaginatedUrl = (
  baseUrl: string,
  params?: PaginationParams
) => {
  const page = params?.page ?? 1;
  const perPage = params?.per_page ?? 10;
  return `${baseUrl}?page=${page}&per_page=${perPage}`;
};
