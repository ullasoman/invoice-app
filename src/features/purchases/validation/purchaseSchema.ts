import { z } from "zod";

// ✅ Line schema — all numeric fields are guaranteed as numbers
export const purchaseLineSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  item_id: z.string().min(1, "Item is required"),

  quantity: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Quantity must be greater than 0"),

  unit: z.string().optional(),

  unit_price: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 0, "Unit price must be valid"),

  discount_type: z.enum(["percentage", "fixed"]).nullable().optional(),

  discount_value: z
    .union([z.string(), z.number(), z.null()])
    .transform((val) => (val == null ? null : Number(val)))
    .nullable()
    .optional(),

  discount_amount: z
    .union([z.string(), z.number(), z.null()])
    .transform((val) => (val == null ? null : Number(val)))
    .nullable()
    .optional(),

  tax_id: z.string().nullable().optional(),

  // ✅ Make totals REQUIRED to align with useForm defaultValues
  sub_total: z.number().default(0),
  tax_amount: z.number().default(0),
  total_amount: z.number().default(0),
});

export const purchaseSchema = z.object({
  supplier_id: z.string().min(1, "Supplier is required"),
  invoice_number: z.string().min(1, "Invoice number is required"),

  purchase_date: z
    .string()
    .min(1, "Purchase date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),

  due_date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid due date"),

  notes: z.string().optional(),

  // ✅ Lines must always exist, with sub_total/tax_amount/total_amount present
  lines: z.array(purchaseLineSchema).min(1, "At least one line is required"),
});

export type PurchaseFormData = z.infer<typeof purchaseSchema>;
