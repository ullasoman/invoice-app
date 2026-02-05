import { z } from "zod";

export const supplierSchema = z
  .object({
    name: z.string().min(1, "Supplier name is required"),
    contact_person: z.string().optional().or(z.literal("")),
    tele_number: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine(
        (v) => v === "" || /^[0-9+\-\s()]{5,20}$/.test(v),
        "Invalid phone format"
      ),
    mobile_number: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine(
        (v) => v === "" || /^[0-9+\-\s()]{5,20}$/.test(v),
        "Invalid mobile format"
      ),
    email: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine((v) => v === "" || /\S+@\S+\.\S+/.test(v), "Invalid email"),
    address: z.string().optional().or(z.literal("")),
    city_id: z.string().min(1, "City is required"),
    notes: z.string().optional().or(z.literal("")),
    is_active: z.enum(["active", "inactive"]),
  })
  .refine(
    (data) =>
      (data.tele_number && data.tele_number.trim() !== "") ||
      (data.mobile_number && data.mobile_number.trim() !== ""),
    { path: ["mobile_number"], message: "Provide at least Phone or Mobile" }
  );

export type SupplierFormData = z.infer<typeof supplierSchema>;
