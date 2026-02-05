import { z } from "zod";

export const buyerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone_number: z.string().optional().or(z.literal("")),
  mobile_number: z.string().optional().or(z.literal("")),
  trn_number: z.string().optional().or(z.literal("")),
  street_address: z.string().optional().or(z.literal("")),
  city_id: z.coerce.number().min(1, "City is required"),
  is_active: z.coerce.number().default(1),
});
