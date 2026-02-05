// src/features/sales/types/salesInvoiceTypes.ts
export interface SalesInvoiceLine {
  id?: number;
  category_id?: string;
  item_id?: string;
  description: string;
  unit: string;
  quantity: number;
  unit_price_ex_vat: number;
  vat_percent: number;
  line_taxable_value: number;
  line_vat_value: number;
  line_total_inc_vat: number;
  last_price?: number;
  last_vat_percent?: number;
  last_amount?: number;
}

export interface SalesInvoice {
  id: number;
  invoice_number: string;
  issue_date: string;
  due_date?: string;
  notes?: string;
  buyer_name: string;
  status: string;
  sub_total: number;
  vat_total: number;
  grand_total: number;
  buyer?: {
    id: number;
    name: string;
    email?: string;
    phone_number?: string;
    trn_number?: string;
    address?: string;
  };
  lines: SalesInvoiceLine[];
}
