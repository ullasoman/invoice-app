import { z } from "zod";

export const estimateLineSchema = z.object({
  id: z.number().optional(),
  category_id: z.string().optional().or(z.literal("")),
  item_id: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  quantity: z.number().min(1, "Quantity required"),
  unit: z.string().optional().or(z.literal("")),
  unit_price: z.number().min(0),
  total_amount: z.number().min(0),
});

export const estimateSchema = z.object({
  buyer_name: z.string().min(1, "Buyer name is required"),
  buyer_address: z.string().optional(),
  issue_date: z.date(),
  notes: z.string().optional(),
  status: z.enum(["DRAFT", "ISSUED"]),
  lines: z.array(estimateLineSchema),
});

export type EstimateFormData = z.infer<typeof estimateSchema>;
export type EstimateLine = z.infer<typeof estimateLineSchema>;
