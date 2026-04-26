"use client";

import { useState, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  X,
  Camera,
} from "lucide-react";
import type { DbRoom, DbRoomFaq, GalleryItem, HeroImageItem, HighlightItem } from "@/lib/types/rooms";

// ─── helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function formatSaveTime(date: Date | null) {
  if (!date) return null;
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Saved just now";
  return `Saved ${Math.floor(diff / 60)} min ago`;
}

function safeArray<T>(raw: unknown): T[] {
  return Array.isArray(raw) ? (raw as T[]) : [];
}

// ─── types ────────────────────────────────────────────────────────────────────

interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

// ─── section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="group bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none hover:bg-[var(--color-cream)]/50 transition-colors list-none">
        <span className="font-body text-sm font-semibold tracking-wider uppercase text-[var(--color-muted)]">
          {title}
        </span>
        <ChevronDown className="w-4 h-4 text-[var(--color-muted)] transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-6 pt-2 space-y-4">{children}</div>
    </details>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-body text-xs text-[var(--color-muted)] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT = "w-full font-body text-sm text-[var(--color-charcoal)] bg-[var(--color-cream)] border border-[var(--color-border)] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30";
const TEXTAREA = `${INPUT} resize-none`;

// ─── main component ───────────────────────────────────────────────────────────

interface Props {
  room: DbRoom;
  initialFaqs: DbRoomFaq[];
}

export function RoomEditor({ room, initialFaqs }: Props) {
  const router = useRouter();

  // ── basic fields ──
  const [name, setName] = useState(room.name);
  const [slug, setSlug] = useState(room.slug);
  const [slugDirty, setSlugDirty] = useState(false);
  const [showSlugWarning, setShowSlugWarning] = useState(false);
  const [tagline, setTagline] = useState(room.tagline ?? "");
  const [descShort, setDescShort] = useState(room.description_short ?? "");
  const [isActive, setIsActive] = useState(room.is_active);
  const [sortOrder, setSortOrder] = useState(room.sort_order);

  // ── pricing & specs ──
  const [price, setPrice] = useState(Number(room.base_price_per_night));
  const [maxOcc, setMaxOcc] = useState(room.max_occupancy);
  const [maxOccChildren, setMaxOccChildren] = useState(room.max_occupancy_children);
  const [bedConfig, setBedConfig] = useState(room.bed_config ?? "");
  const [sizeLabel, setSizeLabel] = useState(room.size_label ?? "");

  // ── arrays ──
  const [amenities, setAmenities] = useState<string[]>(safeArray<string>(room.amenities));
  const [amenityInput, setAmenityInput] = useState("");
  const [highlights, setHighlights] = useState<HighlightItem[]>(safeArray<HighlightItem>(room.highlights));
  const [gallery, setGallery] = useState<GalleryItem[]>(safeArray<GalleryItem>(room.gallery));
  const [heroImage, setHeroImage] = useState<HeroImageItem | null>(
    room.hero_image && typeof room.hero_image === "object" ? (room.hero_image as HeroImageItem) : null,
  );

  // ── SEO ──
  const [seoTitle, setSeoTitle] = useState(room.seo_title ?? "");
  const [seoDesc, setSeoDesc] = useState(room.seo_description ?? "");

  // ── FAQs (direct API, not auto-saved) ──
  const [faqs, setFaqs] = useState<AdminFaq[]>(
    initialFaqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer, display_order: f.display_order })),
  );
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // ── save state ──
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const galleryDragIndex = useRef<number | null>(null);

  // ── Tiptap editor ──
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write the room description…" }),
    ],
    content: room.long_description
      ? (room.long_description as Record<string, unknown>)
      : undefined,
    editorProps: {
      attributes: {
        class:
          "outline-none prose max-w-none font-body text-base text-[var(--color-charcoal)] leading-relaxed min-h-[200px]",
      },
    },
    onUpdate: () => scheduleAutoSave(),
  });

  // ── auto-save ──
  function scheduleAutoSave() {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => { void save(); }, 30000);
  }

  const buildPayload = useCallback(() => ({
    name: name || "Untitled",
    slug,
    tagline: tagline || null,
    description_short: descShort || null,
    is_active: isActive,
    sort_order: sortOrder,
    base_price_per_night: price,
    max_occupancy: maxOcc,
    max_occupancy_children: maxOccChildren,
    bed_config: bedConfig || null,
    size_label: sizeLabel || null,
    amenities,
    highlights,
    gallery,
    hero_image: heroImage,
    long_description: editor?.getJSON() ?? null,
    seo_title: seoTitle || null,
    seo_description: seoDesc || null,
  }), [name, slug, tagline, descShort, isActive, sortOrder, price, maxOcc, maxOccChildren, bedConfig, sizeLabel, amenities, highlights, gallery, heroImage, editor, seoTitle, seoDesc]);

  const save = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/rooms/${room.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Save failed");
      }
      setLastSaved(new Date());
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [room.id, buildPayload]);

  // ── upload helper ──
  async function uploadFile(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", `rooms/${room.slug}`);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (!res.ok) throw new Error("Upload failed");
    const data = (await res.json()) as { url: string };
    return data.url;
  }

  // ── gallery ──
  async function handleGalleryAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      const item: GalleryItem = {
        alt: "",
        webp: { mobile: url, desktop: url },
        jpg: { mobile: url, desktop: url },
      };
      setGallery((prev) => {
        const updated = [...prev, item];
        // Immediate save with updated gallery
        void saveGalleryImmediate(updated);
        return updated;
      });
    } catch {
      setSaveError("Gallery upload failed");
    }
    e.target.value = "";
  }

  function saveGalleryImmediate(updatedGallery: GalleryItem[]) {
    return fetch(`/api/admin/rooms/${room.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gallery: updatedGallery }),
    }).catch(() => {/* best-effort */});
  }

  function handleGalleryAltChange(index: number, alt: string) {
    setGallery((prev) => prev.map((item, i) => (i === index ? { ...item, alt } : item)));
    scheduleAutoSave();
  }

  function handleGalleryDelete(index: number) {
    setGallery((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      void saveGalleryImmediate(updated);
      return updated;
    });
  }

  function handleGalleryDragStart(index: number) {
    galleryDragIndex.current = index;
  }

  function handleGalleryDrop(dropIndex: number) {
    const fromIndex = galleryDragIndex.current;
    if (fromIndex === null || fromIndex === dropIndex) return;
    setGallery((prev) => {
      const reordered = [...prev];
      const [moved] = reordered.splice(fromIndex, 1);
      if (!moved) return prev;
      reordered.splice(dropIndex, 0, moved);
      void saveGalleryImmediate(reordered);
      return reordered;
    });
    galleryDragIndex.current = null;
  }

  // ── hero image ──
  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      const hero: HeroImageItem = {
        alt: "",
        webp: { mobile: url, tablet: url, desktop: url },
        jpg: { mobile: url, tablet: url, desktop: url },
      };
      setHeroImage(hero);
      void fetch(`/api/admin/rooms/${room.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero_image: hero }),
      });
    } catch {
      setSaveError("Hero image upload failed");
    }
    e.target.value = "";
  }

  // ── highlights ──
  function addHighlight() {
    setHighlights((prev) => [...prev, { icon: "Sparkles", title: "", description: "" }]);
    scheduleAutoSave();
  }

  function updateHighlight(index: number, field: keyof HighlightItem, value: string) {
    setHighlights((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
    scheduleAutoSave();
  }

  function removeHighlight(index: number) {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
    scheduleAutoSave();
  }

  function moveHighlight(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= highlights.length) return;
    setHighlights((prev) => {
      const arr = [...prev];
      const temp = arr[index];
      const target = arr[newIndex];
      if (!temp || !target) return prev;
      arr[index] = target;
      arr[newIndex] = temp;
      return arr;
    });
    scheduleAutoSave();
  }

  // ── amenities ──
  function addAmenity(value: string) {
    const trimmed = value.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
      scheduleAutoSave();
    }
    setAmenityInput("");
  }

  function removeAmenity(item: string) {
    setAmenities((prev) => prev.filter((a) => a !== item));
    scheduleAutoSave();
  }

  // ── FAQs ──
  async function addFaq() {
    if (!newFaqQ.trim()) return;
    try {
      const res = await fetch(`/api/admin/rooms/${room.id}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newFaqQ.trim(), answer: newFaqA.trim() }),
      });
      if (!res.ok) throw new Error("Add FAQ failed");
      const data = (await res.json()) as AdminFaq;
      setFaqs((prev) => [...prev, data]);
      setNewFaqQ("");
      setNewFaqA("");
    } catch {
      setSaveError("Could not add FAQ");
    }
  }

  async function updateFaq(id: string, field: "question" | "answer", value: string) {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
    try {
      await fetch(`/api/admin/faqs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
    } catch {/* best-effort */}
  }

  async function deleteFaq(id: string) {
    if (!window.confirm("Delete this FAQ?")) return;
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" }).catch(() => {/* best-effort */});
  }

  async function moveFaq(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= faqs.length) return;
    const reordered = [...faqs];
    const temp = reordered[index];
    const target = reordered[newIndex];
    if (!temp || !target) return;
    reordered[index] = target;
    reordered[newIndex] = temp;
    const withOrder = reordered.map((f, i) => ({ ...f, display_order: i }));
    setFaqs(withOrder);
    await fetch(`/api/admin/rooms/${room.id}/faqs/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(withOrder.map((f) => ({ id: f.id, display_order: f.display_order }))),
    }).catch(() => {/* best-effort */});
  }

  // ── delete room ──
  async function handleDeleteRoom() {
    if (!window.confirm(`Delete "${name}"? This cannot be undone — all FAQs will also be deleted.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/rooms/${room.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/rooms");
    } catch {
      setSaveError("Delete failed");
      setDeleting(false);
    }
  }

  // ─── render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col -m-8 min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 flex items-center gap-4 px-6 py-3 bg-white border-b border-[var(--color-border)]">
        <a
          href="/admin/rooms"
          className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-charcoal)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body text-sm">Rooms</span>
        </a>
        <span className="text-[var(--color-border)]">/</span>
        <span className="font-body text-sm text-[var(--color-charcoal)] truncate max-w-xs">
          {name || "Untitled"}
        </span>

        <div className="flex-1" />

        {saving ? (
          <span className="font-body text-xs italic text-[var(--color-muted)]">Saving…</span>
        ) : lastSaved ? (
          <span className="font-body text-xs italic text-[var(--color-muted)]">{formatSaveTime(lastSaved)}</span>
        ) : null}

        {saveError && (
          <span className="font-body text-xs text-[var(--color-error)]">{saveError}</span>
        )}

        <a
          href={`/stay/${room.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-xs text-[var(--color-muted)] hover:text-[var(--color-charcoal)] transition-colors"
        >
          View public ↗
        </a>

        <button
          type="button"
          onClick={() => { void save(); }}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-[var(--color-gold-accent)] font-body text-sm font-medium text-[var(--color-charcoal)] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Save
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 px-8 py-8 max-w-4xl space-y-4">

        {/* ── Basics ── */}
        <Section title="Basics">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="r-name">
              <input
                id="r-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => { void save(); }}
                className={INPUT}
              />
            </Field>

            <Field label="Slug (URL)">
              <div className="relative">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    const newSlug = slugify(e.target.value);
                    setSlugDirty(true);
                    if (!slugDirty) {
                      setShowSlugWarning(true);
                    }
                    setSlug(newSlug);
                  }}
                  onBlur={() => { if (slugDirty) void save(); }}
                  className={INPUT}
                />
                {showSlugWarning && (
                  <p className="mt-1 font-body text-xs text-[var(--color-error)]">
                    ⚠ Changing the slug breaks existing links to /stay/{room.slug}. Proceed with care.
                  </p>
                )}
              </div>
            </Field>

            <Field label="Tagline" htmlFor="r-tagline">
              <input
                id="r-tagline"
                type="text"
                value={tagline}
                onChange={(e) => { setTagline(e.target.value); scheduleAutoSave(); }}
                onBlur={() => { void save(); }}
                className={INPUT}
              />
            </Field>

            <Field label="Short description" htmlFor="r-desc-short">
              <input
                id="r-desc-short"
                type="text"
                value={descShort}
                onChange={(e) => { setDescShort(e.target.value); scheduleAutoSave(); }}
                onBlur={() => { void save(); }}
                className={INPUT}
              />
            </Field>

            <Field label="Sort order" htmlFor="r-sort">
              <input
                id="r-sort"
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => { setSortOrder(Number(e.target.value)); scheduleAutoSave(); }}
                onBlur={() => { void save(); }}
                className={INPUT}
              />
            </Field>

            <Field label="Status">
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsActive((v) => {
                      void fetch(`/api/admin/rooms/${room.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ is_active: !v }),
                      });
                      return !v;
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-earth-brown)] ${isActive ? "bg-[var(--color-moss-green)]" : "bg-[var(--color-border)]"}`}
                  role="switch"
                  aria-checked={isActive}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
                <span className="font-body text-sm text-[var(--color-charcoal)]">
                  {isActive ? "Active (visible on site)" : "Draft (hidden from public)"}
                </span>
              </div>
            </Field>
          </div>
        </Section>

        {/* ── Pricing & Specs ── */}
        <Section title="Pricing & Specs">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Price / night (₹ incl. GST)" htmlFor="r-price">
              <input
                id="r-price"
                type="number"
                min={0}
                value={price}
                onChange={(e) => { setPrice(Number(e.target.value)); scheduleAutoSave(); }}
                onBlur={() => { void save(); }}
                className={INPUT}
              />
            </Field>
            <Field label="Max adults" htmlFor="r-occ">
              <input id="r-occ" type="number" min={1} value={maxOcc}
                onChange={(e) => { setMaxOcc(Number(e.target.value)); scheduleAutoSave(); }}
                onBlur={() => { void save(); }} className={INPUT} />
            </Field>
            <Field label="Max children" htmlFor="r-occ-c">
              <input id="r-occ-c" type="number" min={0} value={maxOccChildren}
                onChange={(e) => { setMaxOccChildren(Number(e.target.value)); scheduleAutoSave(); }}
                onBlur={() => { void save(); }} className={INPUT} />
            </Field>
            <Field label="Bed config" htmlFor="r-bed">
              <input id="r-bed" type="text" value={bedConfig}
                onChange={(e) => { setBedConfig(e.target.value); scheduleAutoSave(); }}
                onBlur={() => { void save(); }} className={INPUT} placeholder="e.g. 1 King Bed" />
            </Field>
            <Field label="Size" htmlFor="r-size">
              <input id="r-size" type="text" value={sizeLabel}
                onChange={(e) => { setSizeLabel(e.target.value); scheduleAutoSave(); }}
                onBlur={() => { void save(); }} className={INPUT} placeholder="e.g. Approx. 350 sq ft" />
            </Field>
          </div>
        </Section>

        {/* ── Long Description ── */}
        <Section title="Long Description">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] p-4">
            <EditorContent editor={editor} />
          </div>
          <p className="font-body text-xs text-[var(--color-muted)]">
            Auto-saves after 30 seconds. Use Shift+Enter for line breaks within a paragraph.
          </p>
        </Section>

        {/* ── Amenities ── */}
        <Section title="Amenities">
          <div className="flex flex-wrap gap-2 mb-3">
            {amenities.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 bg-[var(--color-cream)] text-[var(--color-earth-brown)] font-body text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)]"
              >
                {item}
                <button type="button" onClick={() => removeAmenity(item)} className="hover:text-[var(--color-error)] ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(amenityInput); } }}
              placeholder="Add amenity…"
              className={`flex-1 ${INPUT}`}
            />
            <button
              type="button"
              onClick={() => addAmenity(amenityInput)}
              className="px-4 py-2 bg-[var(--color-cream)] border border-[var(--color-border)] rounded-xl font-body text-sm hover:border-[var(--color-earth-brown)] transition-colors"
            >
              <Plus className="w-4 h-4 text-[var(--color-earth-brown)]" />
            </button>
          </div>
        </Section>

        {/* ── Highlights ── */}
        <Section title="Highlights (max 4)">
          <div className="space-y-3">
            {highlights.map((h, index) => (
              <div key={index} className="rounded-xl border border-[var(--color-border)] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => moveHighlight(index, -1)} disabled={index === 0} className="p-0.5 text-[var(--color-muted)] hover:text-[var(--color-charcoal)] disabled:opacity-30">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => moveHighlight(index, 1)} disabled={index === highlights.length - 1} className="p-0.5 text-[var(--color-muted)] hover:text-[var(--color-charcoal)] disabled:opacity-30">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input type="text" value={h.icon} onChange={(e) => updateHighlight(index, "icon", e.target.value)} onBlur={() => { void save(); }} placeholder="Icon (e.g. Bath)" className={INPUT} />
                    <input type="text" value={h.title} onChange={(e) => updateHighlight(index, "title", e.target.value)} onBlur={() => { void save(); }} placeholder="Title" className={INPUT} />
                    <input type="text" value={h.description} onChange={(e) => updateHighlight(index, "description", e.target.value)} onBlur={() => { void save(); }} placeholder="Description" className={INPUT} />
                  </div>
                  <button type="button" onClick={() => removeHighlight(index)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {highlights.length < 4 && (
            <button type="button" onClick={addHighlight} className="flex items-center gap-2 font-body text-sm text-[var(--color-earth-brown)] hover:underline">
              <Plus className="w-4 h-4" /> Add highlight
            </button>
          )}
          <p className="font-body text-xs text-[var(--color-muted)]">
            Icon must be a valid lucide-react component name, e.g. Bath, BedDouble, Trees, ShowerHead.
          </p>
        </Section>

        {/* ── Hero Image ── */}
        <Section title="Hero Image (listing card)">
          <input type="file" accept="image/jpeg,image/png,image/webp" id="hero-upload" className="hidden" onChange={handleHeroUpload} />
          <label
            htmlFor="hero-upload"
            className="block w-full max-w-sm aspect-[3/2] border-2 border-dashed border-[var(--color-border)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--color-earth-brown)] transition-colors group"
          >
            {heroImage ? (
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroImage.webp.desktop} alt={heroImage.alt || "Hero"} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="font-body text-sm text-white">Replace</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--color-muted)]">
                <Camera className="w-6 h-6" />
                <span className="font-body text-xs text-center">Click to upload<br />listing card image</span>
              </div>
            )}
          </label>
          {heroImage && (
            <div className="max-w-sm">
              <label className="block font-body text-xs text-[var(--color-muted)] mb-1">Alt text</label>
              <input
                type="text"
                value={heroImage.alt}
                onChange={(e) => {
                  const updated = { ...heroImage, alt: e.target.value };
                  setHeroImage(updated);
                }}
                onBlur={() => {
                  void fetch(`/api/admin/rooms/${room.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ hero_image: heroImage }),
                  });
                }}
                className={INPUT}
                placeholder="Describe the image for accessibility"
              />
            </div>
          )}
        </Section>

        {/* ── Gallery ── */}
        <Section title="Gallery (detail page images)">
          <div className="space-y-3">
            {gallery.map((item, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleGalleryDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleGalleryDrop(index)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] cursor-default"
              >
                <GripVertical className="w-4 h-4 text-[var(--color-muted)] flex-shrink-0 cursor-grab" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.webp.desktop} alt={item.alt || ""} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                <input
                  type="text"
                  value={item.alt}
                  onChange={(e) => handleGalleryAltChange(index, e.target.value)}
                  onBlur={() => { void saveGalleryImmediate(gallery); }}
                  placeholder="Alt text…"
                  className={`flex-1 ${INPUT} py-1.5`}
                />
                <button type="button" onClick={() => handleGalleryDelete(index)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <input type="file" accept="image/jpeg,image/png,image/webp" id="gallery-upload" className="hidden" onChange={handleGalleryAdd} />
            <label
              htmlFor="gallery-upload"
              className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-[var(--color-border)] rounded-xl font-body text-sm text-[var(--color-earth-brown)] cursor-pointer hover:border-[var(--color-earth-brown)] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add image
            </label>
          </div>
          <p className="font-body text-xs text-[var(--color-muted)]">
            Drag to reorder. First image is displayed full-width on the detail page.
          </p>
        </Section>

        {/* ── FAQs ── */}
        <Section title={`FAQs (${faqs.length})`}>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="rounded-xl border border-[var(--color-border)] p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => { void moveFaq(index, -1); }} disabled={index === 0} className="p-1 text-[var(--color-muted)] hover:text-[var(--color-charcoal)] disabled:opacity-30">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => { void moveFaq(index, 1); }} disabled={index === faqs.length - 1} className="p-1 text-[var(--color-muted)] hover:text-[var(--color-charcoal)] disabled:opacity-30">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button type="button" onClick={() => { void deleteFaq(faq.id); }} className="p-1 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={faq.question}
                  onChange={(e) => { void updateFaq(faq.id, "question", e.target.value); }}
                  rows={2}
                  placeholder="Question"
                  className={TEXTAREA}
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => { void updateFaq(faq.id, "answer", e.target.value); }}
                  rows={3}
                  placeholder="Answer"
                  className={TEXTAREA}
                />
              </div>
            ))}
          </div>

          {/* Add FAQ */}
          <div className="rounded-xl border border-dashed border-[var(--color-border)] p-4 space-y-2">
            <p className="font-body text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Add FAQ</p>
            <textarea
              value={newFaqQ}
              onChange={(e) => setNewFaqQ(e.target.value)}
              rows={2}
              placeholder="Question"
              className={TEXTAREA}
            />
            <textarea
              value={newFaqA}
              onChange={(e) => setNewFaqA(e.target.value)}
              rows={3}
              placeholder="Answer"
              className={TEXTAREA}
            />
            <button
              type="button"
              onClick={() => { void addFaq(); }}
              disabled={!newFaqQ.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-cream)] border border-[var(--color-border)] rounded-xl font-body text-sm hover:border-[var(--color-earth-brown)] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-[var(--color-earth-brown)]" /> Add FAQ
            </button>
          </div>
        </Section>

        {/* ── SEO ── */}
        <Section title="SEO">
          <Field label={`SEO Title (${seoTitle.length}/60)`} htmlFor="r-seo-title">
            <input
              id="r-seo-title"
              type="text"
              value={seoTitle}
              maxLength={70}
              onChange={(e) => { setSeoTitle(e.target.value); scheduleAutoSave(); }}
              onBlur={() => { void save(); }}
              className={INPUT}
              placeholder={`${name} | Madhuban Eco Retreat`}
            />
          </Field>
          <Field label={`SEO Description (${seoDesc.length}/160)`} htmlFor="r-seo-desc">
            <textarea
              id="r-seo-desc"
              value={seoDesc}
              rows={3}
              maxLength={170}
              onChange={(e) => { setSeoDesc(e.target.value); scheduleAutoSave(); }}
              onBlur={() => { void save(); }}
              className={TEXTAREA}
              placeholder={tagline || "Describe this room for search engines…"}
            />
          </Field>
        </Section>

        {/* ── Danger zone ── */}
        <div className="rounded-2xl border border-[var(--color-error)]/30 p-6">
          <p className="font-body text-sm font-medium text-[var(--color-charcoal)] mb-1">Delete this room</p>
          <p className="font-body text-xs text-[var(--color-muted)] mb-4">
            Permanently deletes the room and all {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""}. Cannot be undone.
          </p>
          <button
            type="button"
            onClick={() => { void handleDeleteRoom(); }}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-error)]/50 rounded-xl font-body text-sm text-[var(--color-error)] hover:bg-[var(--color-error)]/5 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting…" : `Delete "${name}"`}
          </button>
        </div>
      </div>
    </div>
  );
}
