import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { RoomEditor } from "../../room-editor";
import type { DbRoom, DbRoomFaq } from "@/lib/types/rooms";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRoomPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [roomRes, faqsRes] = await Promise.all([
    supabase.from("rooms").select("*").eq("id", id).single(),
    supabase.from("room_faqs").select("*").eq("room_id", id).order("display_order"),
  ]);

  if (roomRes.error || !roomRes.data) notFound();

  return (
    <RoomEditor
      room={roomRes.data as DbRoom}
      initialFaqs={(faqsRes.data ?? []) as DbRoomFaq[]}
    />
  );
}
