import api from "@/shared/api/api";
import { PaymentFormData } from "../validation/paymentSchema";

export const fetchPayments = async () => {
  const res = await api.get("/payments");
  return res.data?.data || [];
};

export const fetchInvoices = async (url?: string) => {
  const endpoint = url || "/sales/invoices?payment_status=pending";
  const res = await api.get(endpoint);
  return res.data; // returns the full pagination object
};


export const createPayment = async (data: PaymentFormData) => {
  const payload = {
    invoice_id: Number(data.invoice_id),
    amount: Number(data.amount),
    method: data.method,
    reference: data.reference || null,
    notes: data.notes || null,
  };
  const res = await api.post("/payments", payload);
  return res.data;
};
