"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RoomNewForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Create failed");
      }
      const data = (await res.json()) as { id: string };
      router.push(`/admin/rooms/${data.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="room-name"
          className="block font-body text-sm font-medium text-[var(--color-charcoal)] mb-1.5"
        >
          Room name
        </label>
        <input
          id="room-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Safari Tent"
          className="w-full font-body text-sm text-[var(--color-charcoal)] bg-white border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30"
          autoFocus
        />
      </div>

      {error && (
        <p className="font-body text-sm text-[var(--color-error)]">{error}</p>
      )}

      <button
        type="submit"
        disabled={!name.trim() || submitting}
        className="w-full h-12 bg-[var(--color-forest-green)] text-[var(--color-ivory)] rounded-xl font-body text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create Room →"}
      </button>
    </form>
  );
}
