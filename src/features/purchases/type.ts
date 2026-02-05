export interface InvoiceLine {
  category_id?: string;
  item_id: string;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number; // renamed
  discount_type?: "percentage" | "fixed" | null;
  discount_value?: number | null;
  discount_amount?: number | null;
  tax_category_id?: string | null;
  sub_total: number;
  tax_amount: number;
  total_amount: number;
}
