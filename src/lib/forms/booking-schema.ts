import { z } from "zod";

export const ROOM_SLUGS = [
  "safari-tent",
  "mud-house-1",
  "mud-house-2",
  "pool-side-villa",
  "glamping-tents",
  "camping-tent",
] as const;

export type RoomSlug = (typeof ROOM_SLUGS)[number];

export const ROOM_OPTIONS: { value: RoomSlug; label: string }[] = [
  { value: "safari-tent",    label: "Safari Tent" },
  { value: "mud-house-1",    label: "Mud House 1 (with bathtub)" },
  { value: "mud-house-2",    label: "Mud House 2" },
  { value: "pool-side-villa", label: "Pool Side Villa" },
  { value: "glamping-tents", label: "Glamping Tent" },
  { value: "camping-tent",   label: "Camping Tent" },
];

export const bookingSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name must be under 100 characters"),
    email: z.string().email("Enter a valid email address"),
    phone: z
      .string()
      .min(7, "Enter a valid phone number")
      .regex(/^[\+\d\s\-\(\)]{7,20}$/, "Enter a valid phone number"),
    checkIn: z.string().date("Enter a valid check-in date"),
    checkOut: z.string().date("Enter a valid check-out date"),
    adults: z.number().int().min(1, "At least 1 adult required").max(10, "Maximum 10 adults"),
    children: z.number().int().min(0).max(10, "Maximum 10 children"),
    roomType: z.enum(ROOM_SLUGS, { error: "Select a room type" }),
    specialRequests: z.string().max(2000, "Must be under 2000 characters").optional(),
    website: z.string().max(0).optional(),
  })
  .refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;
