import type { Metadata } from "next";
import { getSettings } from "@/lib/admin/settings";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = { title: "Settings — Madhuban Admin" };

export default async function SettingsPage() {
  const settings = await getSettings();
  return <SettingsClient initialSettings={settings} />;
}
