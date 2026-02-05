import { z } from "zod";

export const adjustSchema = z.object({
  quantity: z
    .number()
    .int({ message: "Must be an integer" })
    .refine((n) => n !== 0, { message: "Enter a non-zero adjustment" }),
  reason: z.string().min(1, "Reason is required"),
});

export type AdjustFormData = z.infer<typeof adjustSchema>;
