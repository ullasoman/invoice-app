// src/features/sales/services/salesInvoiceService.ts
import api from "@/shared/api/api";

/**
 * Fetch all sales invoices
 */
export const fetchSalesInvoices = async (params?: any) => {
  const res = await api.get("/sales/invoices", { params });
  return res.data?.data || [];
};

/**
 * Fetch a single sales invoice
 */
export const fetchSalesInvoice = async (id: number | string) => {
  const res = await api.get(`/sales/invoices/${id}`);
  return res.data;
};

/**
 * Create a new sales invoice
 */
export const createSalesInvoice = async (payload: any) => {
  const res = await api.post("/sales/invoices", payload);
  return res.data;
};

/**
 * Update an existing sales invoice
 */
export const updateSalesInvoice = async (id: number | string, payload: any) => {
  const res = await api.put(`/sales/invoices/${id}`, payload);
  return res.data;
};

/**
 * Delete a sales invoice
 */
export const deleteSalesInvoice = async (id: number | string) => {
  const res = await api.delete(`/sales/invoices/${id}`);
  return res.data;
};

/**
 * Mark a sales invoice as paid
 */
export const markSalesInvoicePaid = async (id: number | string) => {
  const res = await api.put(`/sales/invoices/${id}/mark-paid`, {
    status: "PAID",
  });
  return res.data;
};

/**
 * Download a sales invoice PDF
 * Handles file naming and download automatically in the browser.
 */
export const downloadSalesInvoice = async (id: number | string) => {
  try {
    const res = await api.get(`/sales/invoices/${id}/download`, {
      responseType: "blob",
    });

    const disposition = res.headers["content-disposition"];
    let filename = `invoice-${id}.pdf`;

    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("❌ Failed to download invoice", err);
    throw err;
  }
};
