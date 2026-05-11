'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Plus, GripVertical, Pencil, Check, X as XIcon,
  CalendarOff, BedDouble,
} from "lucide-react";
import { toast } from "sonner";
import { Card, Badge, Button, Tabs } from "@/components/admin/ui";
import { computeRoomGstRate } from "@/lib/gst";
import { RoomQuickEditDrawer } from "./room-quick-edit-drawer";
import type { AdminRoom } from "./page";

// ─── helpers ────────────────────────────────────────────────────────────────

function getThumbnailUrl(room: AdminRoom): string | null {
  if (room.hero_image && typeof room.hero_image === "object") {
    const h = room.hero_image as { webp?: { desktop?: string } };
    if (h.webp?.desktop) return h.webp.desktop;
  }
  if (Array.isArray(room.gallery) && room.gallery.length > 0) {
    const first = room.gallery[0] as { webp?: { desktop?: string } } | undefined;
    if (first?.webp?.desktop) return first.webp.desktop;
  }
  return null;
}

function fmtPrice(n: number) { return `₹${n.toLocaleString("en-IN")}`; }

// ─── Tab definitions ─────────────────────────────────────────────────────────

const TABS = [
  { value: "rooms",     label: "Room Types" },
  { value: "rates",     label: "Rates" },
  { value: "seasonal",  label: "Seasonal Rules" },
  { value: "inventory", label: "Inventory" },
];

// ─── Sub-tab components ──────────────────────────────────────────────────────

interface RoomTypesTabProps {
  rooms: AdminRoom[];
  saving: boolean;
  onDragStart: (index: number) => void;
  onDrop: (index: number) => void;
  onQuickEdit: (room: AdminRoom) => void;
}

function RoomTypesTab({ rooms, saving, onDragStart, onDrop, onQuickEdit }: RoomTypesTabProps) {
  if (rooms.length === 0) {
    return (
      <Card>
        <div className="py-12 text-center">
          <BedDouble className="mx-auto mb-4 h-8 w-8 text-charcoal/20" />
          <p className="font-display text-lg text-charcoal/50">No rooms yet</p>
          <p className="mt-1 font-body text-sm text-charcoal/40">Create your first room to get started</p>
          <div className="mt-5">
            <Button href="/admin/rooms/new">
              <Plus className="h-4 w-4" />
              New Room
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card className="overflow-hidden p-0">
      {saving && (
        <div className="border-b border-admin-card-border bg-warm-beige/40 px-6 py-2 text-center font-body text-xs text-charcoal/60">
          Saving order…
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b border-admin-card-border">
            <th className="w-10 px-3 py-3" aria-label="Drag handle" />
            <th className="w-16 px-3 py-3" aria-label="Thumbnail" />
            <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
              Name
            </th>
            <th className="hidden px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50 sm:table-cell">
              Units
            </th>
            <th className="hidden px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50 md:table-cell">
              Status
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-card-border">
          {rooms.map((room, index) => {
            const thumb = getThumbnailUrl(room);
            return (
              <tr
                key={room.id}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(index)}
                className="transition-colors hover:bg-warm-beige/20"
              >
                <td className="cursor-grab px-3 py-3 text-center active:cursor-grabbing">
                  <GripVertical className="mx-auto h-4 w-4 text-charcoal/30" />
                </td>
                <td className="px-3 py-3">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="h-10 w-14 rounded-lg object-cover" />
                  ) : (
                    <div className="h-10 w-14 rounded-lg bg-admin-status-neutral-bg" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="font-body text-sm font-medium text-charcoal">{room.name}</p>
                  <p className="font-body text-xs text-charcoal/40">/stay/{room.slug}</p>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className="font-body text-sm text-charcoal">
                    {room.inventory_count} unit{room.inventory_count !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <Badge variant={room.is_active ? "confirmed" : "neutral"}>
                    {room.is_active ? "Active" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Button variant="secondary" size="sm" onClick={() => onQuickEdit(room)}>
                      <Pencil className="h-3 w-3" />
                      Quick Edit
                    </Button>
                    <Link
                      href={`/admin/rooms/${room.id}/edit`}
                      className="whitespace-nowrap font-body text-xs text-charcoal/50 transition-colors hover:text-earth-brown hover:underline"
                    >
                      Edit details →
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

interface RatesTabProps {
  rooms: AdminRoom[];
  editingId: string | null;
  editingVal: string;
  onStartEdit: (room: AdminRoom) => void;
  onEditValChange: (v: string) => void;
  onSave: (id: string) => Promise<void>;
  onCancel: () => void;
}

function RatesTab({ rooms, editingId, editingVal, onStartEdit, onEditValChange, onSave, onCancel }: RatesTabProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-admin-card-border bg-admin-status-neutral-bg/40 px-6 py-3">
        <p className="font-body text-xs text-charcoal/50">
          GST is always auto-computed from base price — 12% if ≤ ₹7,500, 18% above. The stored{" "}
          <code className="font-mono">gst_rate</code> column is not used in display or pricing.
        </p>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-admin-card-border">
            <th className="px-6 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">Room</th>
            <th className="px-6 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">Base Price / Night</th>
            <th className="px-6 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">GST Rate</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-card-border">
          {rooms.map((room) => {
            const isEditing = editingId === room.id;
            const previewGst = isEditing && editingVal
              ? (() => { const v = parseFloat(editingVal); return isNaN(v) ? null : computeRoomGstRate(v); })()
              : computeRoomGstRate(room.base_price_per_night);
            return (
              <tr key={room.id} className="transition-colors hover:bg-warm-beige/20">
                <td className="px-6 py-4">
                  <p className="font-body text-sm font-medium text-charcoal">{room.name}</p>
                </td>
                <td className="px-6 py-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm text-charcoal/50">₹</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={editingVal}
                        onChange={(e) => onEditValChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { e.preventDefault(); void onSave(room.id); }
                          if (e.key === "Escape") onCancel();
                        }}
                        autoFocus
                        className="h-8 w-32 rounded-lg border border-forest-green bg-admin-card-bg px-2 font-body text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-green/30"
                      />
                      <button
                        type="button"
                        onClick={() => { void onSave(room.id); }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest-green text-ivory hover:bg-forest-green/90 transition-colors"
                        aria-label="Save price"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={onCancel}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-admin-card-border text-charcoal/50 hover:text-charcoal transition-colors"
                        aria-label="Cancel"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="font-body text-sm font-medium text-charcoal">
                      {fmtPrice(Number(room.base_price_per_night))}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {previewGst !== null ? (
                    <span className={`font-body text-sm font-semibold ${previewGst === 18 ? "text-error/80" : "text-forest-green"}`}>
                      {previewGst}%
                    </span>
                  ) : (
                    <span className="font-body text-sm text-charcoal/40">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => onStartEdit(room)}
                      className="inline-flex items-center gap-1 font-body text-xs text-charcoal/50 transition-colors hover:text-earth-brown"
                      aria-label={`Edit price for ${room.name}`}
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function SeasonalRulesTab() {
  return (
    <Card>
      <div className="py-10 text-center">
        <CalendarOff className="mx-auto mb-4 h-8 w-8 text-charcoal/20" />
        <p className="font-display text-lg text-charcoal/50">Seasonal rules coming post-launch</p>
        <p className="mx-auto mt-2 max-w-md font-body text-sm text-charcoal/40">
          Date-based price overrides and multipliers will be managed here using the{" "}
          <code className="font-mono text-xs">pricing_rules</code> table (columns:{" "}
          <code className="font-mono text-xs">rule_type</code>,{" "}
          <code className="font-mono text-xs">date_from</code>,{" "}
          <code className="font-mono text-xs">date_to</code>,{" "}
          <code className="font-mono text-xs">price_override</code>,{" "}
          <code className="font-mono text-xs">multiplier</code>).
        </p>
      </div>
    </Card>
  );
}

interface InventoryTabProps {
  rooms: AdminRoom[];
  editingId: string | null;
  editingVal: string;
  onStartEdit: (room: AdminRoom) => void;
  onEditValChange: (v: string) => void;
  onSave: (id: string) => Promise<void>;
  onCancel: () => void;
}

function InventoryTab({ rooms, editingId, editingVal, onStartEdit, onEditValChange, onSave, onCancel }: InventoryTabProps) {
  const totalUnits = rooms.reduce((s, r) => s + r.inventory_count, 0);
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-admin-card-border bg-admin-status-neutral-bg/40 px-6 py-3">
        <p className="font-body text-xs text-charcoal/50">
          {totalUnits} total unit{totalUnits !== 1 ? "s" : ""} across all room types.
          Inventory sets how many simultaneous bookings each room type can accept.
        </p>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-admin-card-border">
            <th className="px-6 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">Room</th>
            <th className="px-6 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">Units</th>
            <th className="hidden px-6 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50 sm:table-cell">
              Status
            </th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-card-border">
          {rooms.map((room) => {
            const isEditing = editingId === room.id;
            return (
              <tr key={room.id} className="transition-colors hover:bg-warm-beige/20">
                <td className="px-6 py-4">
                  <p className="font-body text-sm font-medium text-charcoal">{room.name}</p>
                  <p className="font-body text-xs text-charcoal/40">/stay/{room.slug}</p>
                </td>
                <td className="px-6 py-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={editingVal}
                        onChange={(e) => onEditValChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { e.preventDefault(); void onSave(room.id); }
                          if (e.key === "Escape") onCancel();
                        }}
                        autoFocus
                        className="h-8 w-20 rounded-lg border border-forest-green bg-admin-card-bg px-2 font-body text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-green/30"
                      />
                      <button
                        type="button"
                        onClick={() => { void onSave(room.id); }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest-green text-ivory hover:bg-forest-green/90 transition-colors"
                        aria-label="Save inventory"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={onCancel}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-admin-card-border text-charcoal/50 hover:text-charcoal transition-colors"
                        aria-label="Cancel"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="font-body text-sm font-medium text-charcoal">
                      {room.inventory_count} unit{room.inventory_count !== 1 ? "s" : ""}
                    </span>
                  )}
                </td>
                <td className="hidden px-6 py-4 sm:table-cell">
                  <Badge variant={room.is_active ? "confirmed" : "neutral"}>
                    {room.is_active ? "Active" : "Draft"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => onStartEdit(room)}
                      className="inline-flex items-center gap-1 font-body text-xs text-charcoal/50 transition-colors hover:text-earth-brown"
                      aria-label={`Edit inventory for ${room.name}`}
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────

export function RoomsAdminClient({ initialRooms }: { initialRooms: AdminRoom[] }) {
  const [rooms, setRooms] = useState<AdminRoom[]>(initialRooms);
  const [activeTab, setActiveTab] = useState("rooms");

  // Quick edit drawer
  const [quickEditRoom, setQuickEditRoom] = useState<AdminRoom | null>(null);

  // Drag reorder (Room Types tab)
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);

  // Inline rate editing
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editingRateVal, setEditingRateVal] = useState("");

  // Inline inventory editing
  const [editingInvId, setEditingInvId] = useState<string | null>(null);
  const [editingInvVal, setEditingInvVal] = useState("");

  function handleDragStart(index: number) { dragIndex.current = index; }

  function handleDrop(dropIndex: number) {
    const from = dragIndex.current;
    if (from === null || from === dropIndex) return;
    const reordered = [...rooms];
    const [moved] = reordered.splice(from, 1);
    if (!moved) return;
    reordered.splice(dropIndex, 0, moved);
    const updated = reordered.map((r, i) => ({ ...r, sort_order: i }));
    setRooms(updated);
    dragIndex.current = null;
    setSaving(true);
    fetch("/api/admin/rooms/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated.map((r) => ({ id: r.id, sort_order: r.sort_order }))),
    })
      .catch(() => {})
      .finally(() => setSaving(false));
  }

  function handleQuickEditSaved(
    id: string,
    updated: Pick<AdminRoom, "base_price_per_night" | "inventory_count" | "is_active">,
  ) {
    setRooms((prev) => prev.map((r) => r.id === id ? { ...r, ...updated } : r));
  }

  async function saveRate(id: string) {
    const val = parseFloat(editingRateVal);
    if (isNaN(val) || val < 0) { toast.error("Enter a valid price"); return; }
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base_price_per_night: val }),
      });
      if (!res.ok) throw new Error();
      setRooms((prev) => prev.map((r) => r.id === id ? { ...r, base_price_per_night: val } : r));
      setEditingRateId(null);
      toast.success("Price updated");
    } catch {
      toast.error("Failed to update price");
    }
  }

  async function saveInventory(id: string) {
    const val = parseInt(editingInvVal, 10);
    if (isNaN(val) || val < 1) { toast.error("Inventory must be at least 1"); return; }
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventory_count: val }),
      });
      if (!res.ok) throw new Error();
      setRooms((prev) => prev.map((r) => r.id === id ? { ...r, inventory_count: val } : r));
      setEditingInvId(null);
      toast.success("Inventory updated");
    } catch {
      toast.error("Failed to update inventory");
    }
  }

  function switchTab(v: string) {
    setActiveTab(v);
    setEditingRateId(null);
    setEditingInvId(null);
  }

  return (
    <>
      <RoomQuickEditDrawer
        open={quickEditRoom !== null}
        onClose={() => setQuickEditRoom(null)}
        room={quickEditRoom}
        onSaved={handleQuickEditSaved}
      />

      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-charcoal">Rooms</h1>
          <p className="mt-0.5 font-body text-sm text-charcoal/50">
            {rooms.length} room type{rooms.length !== 1 ? "s" : ""}
            {" · "}
            {rooms.reduce((s, r) => s + r.inventory_count, 0)} total units
          </p>
        </div>
        <Button href="/admin/rooms/new">
          <Plus className="h-4 w-4" />
          New Room
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} value={activeTab} onChange={switchTab} className="mb-6" />

      {/* Tab content */}
      {activeTab === "rooms" && (
        <RoomTypesTab
          rooms={rooms}
          saving={saving}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onQuickEdit={(r) => setQuickEditRoom(r)}
        />
      )}

      {activeTab === "rates" && (
        <RatesTab
          rooms={rooms}
          editingId={editingRateId}
          editingVal={editingRateVal}
          onStartEdit={(r) => { setEditingRateId(r.id); setEditingRateVal(String(r.base_price_per_night)); }}
          onEditValChange={setEditingRateVal}
          onSave={saveRate}
          onCancel={() => setEditingRateId(null)}
        />
      )}

      {activeTab === "seasonal" && <SeasonalRulesTab />}

      {activeTab === "inventory" && (
        <InventoryTab
          rooms={rooms}
          editingId={editingInvId}
          editingVal={editingInvVal}
          onStartEdit={(r) => { setEditingInvId(r.id); setEditingInvVal(String(r.inventory_count)); }}
          onEditValChange={setEditingInvVal}
          onSave={saveInventory}
          onCancel={() => setEditingInvId(null)}
        />
      )}
    </>
  );
}
