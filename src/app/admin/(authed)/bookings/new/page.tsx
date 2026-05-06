import type { Metadata } from "next";
import { BookingNewForm } from "./booking-new-form";

export const metadata: Metadata = { title: "New Booking — Madhuban Admin" };

export default function NewBookingPage() {
  return <BookingNewForm />;
}
