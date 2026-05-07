import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { NotificationRow } from "@/lib/supabase/database.types";

const ADMIN_RECIPIENT = "madhubanecoretreat@gmail.com";

export type NotificationType = NotificationRow["type"];

export async function createNotification(params: {
  type: NotificationType;
  title: string;
  body: string;
  linkUrl?: string;
}) {
  const supabase = createAdminClient();
  await supabase.from("notifications").insert({
    recipient_email: ADMIN_RECIPIENT,
    type: params.type,
    title: params.title,
    body: params.body,
    link_url: params.linkUrl ?? null,
  });
}
