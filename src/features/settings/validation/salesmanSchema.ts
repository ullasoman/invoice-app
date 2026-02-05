import { z } from "zod";

const phoneRegex = /^[0-9+\-\s()]{5,20}$/;

export const salesmanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone_number: z
    .string()
    .optional()
    .refine((v) => !v || phoneRegex.test(v), {
      message: "Invalid phone format",
    }),
  password: z.string().optional(),
});

export type SalesmanFormData = z.infer<typeof salesmanSchema>;
