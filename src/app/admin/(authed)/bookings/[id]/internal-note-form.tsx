"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { Button, TextArea, EmptyState } from "@/components/admin/ui";

type StaffNote = { text: string; author_email: string; created_at: string };

interface Props {
  bookingId: string;
  initialNotes: StaffNote[];
}

function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtShortEmail(email: string): string {
  return email.split("@")[0] ?? email;
}

export function StaffNotesPanel({ bookingId, initialNotes }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState<StaffNote[]>([...initialNotes].reverse());
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; notes?: StaffNote[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to add note");
      if (data.notes) setNotes([...data.notes].reverse());
      setText("");
      toast.success("Note added");
      startTransition(() => router.refresh());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      {notes.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-5 h-5" />}
          title="No notes yet"
          description="Add the first note below."
          className="py-6"
        />
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {notes.map((note, i) => (
            <li key={i} className="rounded-xl border border-admin-card-border bg-admin-status-neutral-bg p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-body text-xs font-semibold text-charcoal">
                  {fmtShortEmail(note.author_email)}
                </span>
                <span className="font-body text-xs text-charcoal/50">{fmtRelative(note.created_at)}</span>
              </div>
              <p className="font-body text-sm text-charcoal/80 whitespace-pre-wrap">{note.text}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2 border-t border-admin-card-border pt-3">
        <TextArea
          label="Add a note"
          placeholder="Staff-only note…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        <Button
          variant="primary"
          size="sm"
          loading={saving || isPending}
          disabled={!text.trim()}
          onClick={() => void handleSubmit()}
        >
          Add Note
        </Button>
      </div>
    </div>
  );
}

export { StaffNotesPanel as InternalNoteForm };
