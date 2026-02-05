import { z } from "zod";

const phoneRegex = /^[0-9+\-\s()]{5,20}$/;

export const companySchema = z.object({
  logo_url: z.string().optional(),
  business_name: z.string().min(1, "Business name is required"),
  address: z.string().optional(),
  tele_phone_number: z
    .string()
    .optional()
    .refine((v) => !v || phoneRegex.test(v), {
      message: "Invalid phone format",
    }),
  mobile_number: z
    .string()
    .optional()
    .refine((v) => !v || phoneRegex.test(v), {
      message: "Invalid mobile format",
    }),
  whatsapp_number: z
    .string()
    .optional()
    .refine((v) => !v || phoneRegex.test(v), {
      message: "Invalid WhatsApp number",
    }),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /\S+@\S+\.\S+/.test(v), {
      message: "Invalid email",
    }),
  city_id: z.string().min(1, "City is required"),
  trn_number: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{15}$/.test(v), {
      message: "TRN must be 15 digits",
    }),
});

export type CompanyFormData = z.infer<typeof companySchema>;
