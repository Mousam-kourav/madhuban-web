"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function InternalNoteForm({
  bookingId,
  initialNote,
}: {
  bookingId: string;
  initialNote: string;
}) {
  const router = useRouter();
  const [note, setNote] = useState(initialNote);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "INTERNAL_NOTE", note }),
      });
      router.refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        placeholder="Private note for the team…"
        className="w-full rounded-lg border border-border bg-cream px-3 py-2 font-body text-sm text-charcoal placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-earth-brown"
      />
      <button
        onClick={() => void handleSave()}
        disabled={saving}
        className="inline-flex h-9 items-center rounded-lg bg-earth-brown px-4 font-body text-xs font-medium text-ivory transition-colors hover:bg-earth-brown/90 disabled:opacity-50"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save Note"}
      </button>
    </div>
  );
}
