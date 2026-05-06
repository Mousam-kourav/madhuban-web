'use client';

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Drawer, Button, Input, Toggle } from "@/components/admin/ui";
import { computeRoomGstRate } from "@/lib/gst";
import type { AdminRoom } from "./page";

interface Props {
  open: boolean;
  onClose: () => void;
  room: AdminRoom | null;
  onSaved: (id: string, updated: Pick<AdminRoom, "base_price_per_night" | "inventory_count" | "is_active">) => void;
}

// Inner form component — keyed by room.id so state resets cleanly on room change
function QuickEditForm({
  room,
  onSaved,
  onClose,
}: {
  room: AdminRoom;
  onSaved: Props["onSaved"];
  onClose: () => void;
}) {
  const [price, setPrice] = useState(String(room.base_price_per_night));
  const [inventory, setInventory] = useState(String(room.inventory_count));
  const [isActive, setIsActive] = useState(room.is_active);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedPrice = parseFloat(price);
  const derivedGst = !isNaN(parsedPrice) && parsedPrice > 0
    ? computeRoomGstRate(parsedPrice)
    : null;

  async function handleSave() {
    const priceVal = parseFloat(price);
    const invVal = parseInt(inventory, 10);
    if (isNaN(priceVal) || priceVal < 0) { setError("Enter a valid price"); return; }
    if (isNaN(invVal) || invVal < 1) { setError("Inventory must be at least 1"); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rooms/${room.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base_price_per_night: priceVal, inventory_count: invVal, is_active: isActive }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to save");
      }
      onSaved(room.id, { base_price_per_night: priceVal, inventory_count: invVal, is_active: isActive });
      toast.success("Room updated");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <p className="rounded-xl bg-error/10 px-4 py-2.5 font-body text-sm text-error">{error}</p>
      )}

      <Input
        label="Base Price per Night (₹)"
        type="number"
        min={0}
        step={100}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        helperText={derivedGst !== null ? `→ ${derivedGst}% GST applies at this price` : undefined}
      />

      <Input
        label="Inventory Count"
        type="number"
        min={1}
        step={1}
        value={inventory}
        onChange={(e) => setInventory(e.target.value)}
        helperText="Number of physical units of this room type"
      />

      <div className="rounded-xl border border-admin-card-border p-4">
        <Toggle
          checked={isActive}
          onChange={setIsActive}
          label="Visible in booking engine"
          description={isActive ? "Guests can book this room" : "Hidden from public availability"}
        />
      </div>

      <div className="border-t border-admin-card-border pt-5 space-y-3">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={saving}>
            Cancel
          </Button>
          <Button onClick={() => { void handleSave(); }} loading={saving} className="flex-1">
            Save Quick Edits
          </Button>
        </div>
        <p className="text-center">
          <Link
            href={`/admin/rooms/${room.id}/edit`}
            className="font-body text-xs text-charcoal/50 hover:text-earth-brown hover:underline transition-colors"
          >
            Edit full details (description, images, amenities, SEO) →
          </Link>
        </p>
      </div>
    </div>
  );
}

export function RoomQuickEditDrawer({ open, onClose, room, onSaved }: Props) {
  return (
    <Drawer open={open} onClose={onClose} title={room?.name ?? "Quick Edit"} size="sm">
      {room && (
        <QuickEditForm key={room.id} room={room} onSaved={onSaved} onClose={onClose} />
      )}
    </Drawer>
  );
}
