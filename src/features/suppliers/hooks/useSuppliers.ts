import { useEffect, useMemo, useState, useCallback } from "react";
import { fetchSuppliers, fetchCities } from "../services/supplierService";
import { toast } from "sonner";
import { City, Supplier } from "@/types";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // ✅ Proper refetch function updates state
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const supplierData = await fetchSuppliers();
      setSuppliers(supplierData || []);
      const cityData = await fetchCities();
      setCities(cityData || []);
    } catch {
      toast.error("Failed to fetch suppliers or cities");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    refetch();
  }, [refetch]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return suppliers.filter((s) => {
      const matchesQ =
        !q ||
        (s.name || "").toLowerCase().includes(q) ||
        (s.contact_person || "").toLowerCase().includes(q) ||
        (s.tele_number || "").toLowerCase().includes(q) ||
        (s.mobile_number || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (!!s.is_active ? "active" : "inactive") === statusFilter;

      return matchesQ && matchesStatus;
    });
  }, [suppliers, searchTerm, statusFilter]);

  return {
    suppliers,
    cities,
    filtered,
    loading,
    setSuppliers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    refetch,
  };
}
