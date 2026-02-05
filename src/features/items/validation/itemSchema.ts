import * as z from "zod";

export const itemSchema = z.object({
  id: z.string().optional(),
  image: z.any().optional(), // file input
  name: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  cartonRate: z.string().min(1, "Carton rate is required"),
  singlePieceRate: z.string().min(1, "Single piece rate is required"),
  sellingPrice: z.string().min(1, "Selling price is required"),
  taxRate: z.string().min(1, "Tax rate is required"),
  tax: z.string().optional(), // computed
  quantity: z.string().min(1, "Quantity is required"),
  units: z.string().min(1, "Units required"),
  alertQuantity: z.string().min(1, "Alert quantity is required"),
  description: z.string().optional(),
});

export type ItemFormData = z.infer<typeof itemSchema>;
