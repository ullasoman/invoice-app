import api from "@/shared/api/api";

/**
 * Fetch overall dashboard metrics.
 * Backend should return summary data like totals, counts, KPIs, etc.
 */
export async function fetchDashboardSummary() {
  const { data } = await api.get("/dashboard/summary");
  return data;
}

/**
 * Fetch recent invoices (limit 5)
 */
export async function fetchRecentInvoices(limit = 5) {
  const { data } = await api.get(`/sales/invoices?limit=${limit}&sort=desc`);
  return data?.data || [];
}

/**
 * Fetch recent expenses (limit 5)
 */
export async function fetchRecentExpenses(limit = 5) {
  const { data } = await api.get(`/expenses?limit=${limit}&sort=desc`);
  return data?.data || [];
}

/**
 * Fetch buyers/customers
 */
export async function fetchBuyers() {
  const { data } = await api.get("/buyers");
  return data || [];
}

/**
 * Fetch all items (for stock or low-stock alerts)
 */
export async function fetchItems() {
  const { data } = await api.get("/items");
  return data?.data || [];
}

/**
 * Fetch invoices (for full system overview or client stats)
 */
export async function fetchInvoices() {
  const { data } = await api.get("/sales/invoices");
  return data?.data || [];
}

/**
 * Fetch expenses (for monthly summary or analytics)
 */
export async function fetchExpenses() {
  const { data } = await api.get("/expenses");
  return data?.data || [];
}

/**
 * Fetch payments (if needed for dashboard KPIs)
 */
export async function fetchPayments() {
  const { data } = await api.get("/payments");
  return data?.data || [];
}
