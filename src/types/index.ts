export interface City {
  id: number;
  name: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  tele_number?: string | null;
  mobile_number?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  is_active: boolean | number;
  created_at: string;
  city?: City | null;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}
export interface Unit {
  id: number;
  name: string;
}
export interface Buyer {
  id: number;
  name: string;
  phone_number?: string | null;
  mobile_number?: string | null;
  email?: string | null;
  trn_number?: string | null;
  street_address?: string | null;
  emirate?: string | null;
  is_active: boolean | number;
}

export interface Salesman {
  id: number;
  salesmen_id: string;
  name: string;
  phone_number: string;
}

export interface EstimateLine {
  id?: number;
  category_id: string;
  item_id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  base_price?: number;
  discount_amount?: number;
  sub_total?: number;
  tax_amount?: number;
  total_amount?: number;
  category?: { id: number; name: string };
  tax?: { id: number; tax_rate: number };
  item?: { id: number; name: string };
}
export interface Estimate {
  id: number;
  estimate_number: string;
  issue_date: Date;
  buyer_name: string;
  buyer_address: string;
  notes?: string;
  status: string;
  sub_total: number;
  grand_total: number;
  lines: EstimateLine[];
}

export interface CommandOption {
  value: string;
  label: string;
  subtitle?: string;
}
interface CommandSelectProps {
  options: CommandOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

export interface Item {
  id: string;
  sku?: string;
  name: string;
  quantity: number;
  description?: string;
  code: string;
  unit: string;
  purchase_price?: string;
  selling_price: number;
  tax_rate: string;
  alert_quantity?: number;
  category: Category;
  is_active: boolean;
}

type PaymentMethod = "cash" | "card" | "bank_transfer" | "check";

export interface Invoice {
  id: number | string;
  invoice_number?: string;
  grand_total_inc_vat?: number | string;
  grandTotal?: number | string;
  shop?: { name?: string | null } | null;
  customer?: { display_name?: string | null } | null;
}

export interface Payment {
  id: number | string;
  amount: number | string;
  method: PaymentMethod;
  reference?: string | null;
  notes?: string | null;
  created_at?: string;
  createdAt?: string;
  payable?: {
    invoice_number?: string | null;
    grand_total?: number;
    payment_status?: string | null;
  } | null;
}
