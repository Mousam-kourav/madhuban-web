import { z } from "zod";
import { isValidPhone, PHONE_ERROR } from "@/lib/validation/phone";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().refine((v) => !v || isValidPhone(v), PHONE_ERROR).optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
  website: z.string().max(0).optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
