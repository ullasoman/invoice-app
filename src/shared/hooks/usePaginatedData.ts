// src/shared/hooks/usePaginatedData.ts
import { useState, useEffect, useCallback } from "react";
import api from "@/shared/api/api";
import { PaginatedResponse, buildPaginatedUrl } from "@/shared/api/pagination";

export function usePaginatedData<T>(endpoint: string, perPage = 20) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (page = 1, append = false) => {
      try {
        setLoading(true);
        const url = buildPaginatedUrl(endpoint, { page, per_page: perPage });
        const res = await api.get<PaginatedResponse<T>>(url);

        setData((prev) =>
          append ? [...prev, ...res.data.data] : res.data.data
        );
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          total: res.data.total,
        });
      } catch (err) {
        console.error(`Failed to fetch ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, perPage]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const loadMore = () => {
    if (pagination.current_page < pagination.last_page) {
      fetchData(pagination.current_page + 1, true);
    }
  };

  return {
    data,
    loading,
    pagination,
    loadMore,
    refresh: () => fetchData(1),
  };
}
