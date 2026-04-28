import { z } from "zod";

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format");

export const checkAvailabilitySchema = z.object({
  roomId: z.string().uuid(),
  checkIn: dateStr,
  checkOut: dateStr,
}).refine((d) => d.checkOut > d.checkIn, {
  message: "Check-out must be after check-in",
  path: ["checkOut"],
});

export const calculatePriceSchema = z.object({
  roomSlug: z.string().min(1),
  checkIn: dateStr,
  checkOut: dateStr,
  adults: z.number().int().min(1).max(10),
  children: z.number().int().min(0).max(10),
  couponCode: z.string().max(30).optional(),
}).refine((d) => d.checkOut > d.checkIn, {
  message: "Check-out must be after check-in",
  path: ["checkOut"],
});

export const createBookingSchema = z.object({
  roomSlug: z.string().min(1),
  checkIn: dateStr,
  checkOut: dateStr,
  adults: z.number().int().min(1).max(10),
  children: z.number().int().min(0).max(10),
  guestName: z.string().min(1).max(100),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(7).max(20),
  specialRequests: z.string().max(2000).optional(),
  couponCode: z.string().max(30).optional(),
}).refine((d) => d.checkOut > d.checkIn, {
  message: "Check-out must be after check-in",
  path: ["checkOut"],
});

export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type CalculatePriceInput = z.infer<typeof calculatePriceSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
