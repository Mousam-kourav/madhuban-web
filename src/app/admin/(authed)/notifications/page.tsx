import type { Metadata } from "next";
import { NotificationsClient } from "./notifications-client";

export const metadata: Metadata = { title: "Notifications — Madhuban Admin" };

export default function NotificationsPage() {
  return <NotificationsClient />;
}
