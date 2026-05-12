'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Plus, Search, Pencil, Trash2, Images, Play,
  X, Loader2, CheckSquare, Square,
  ChevronDown, AlertTriangle, RefreshCcw, Crop as CropIcon, Check,
} from 'lucide-react';
import type { GalleryItemRow, GalleryCategory } from '@/lib/supabase/database.types';
import { ImageCropper, type CropResult } from '@/components/admin/ImageCropper';

const CATEGORIES: { value: GalleryCategory | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All Categories', color: '' },
  { value: 'stays', label: 'Stays', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'dining', label: 'Dining', color: 'bg-amber-100 text-amber-800' },
  { value: 'aranyashala', label: 'Aranyashala', color: 'bg-green-100 text-green-800' },
  { value: 'forest', label: 'Forest', color: 'bg-teal-100 text-teal-800' },
  { value: 'events', label: 'Events', color: 'bg-purple-100 text-purple-800' },
  { value: 'behind-the-scenes', label: 'Behind the Scenes', color: 'bg-slate-100 text-slate-800' },
];

const GALLERY_ASPECT = 4 / 3;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

function getCategoryColor(category: string) {
  return CATEGORIES.find((c) => c.value === category)?.color ?? 'bg-gray-100 text-gray-700';
}
function getCategoryLabel(category: string) {
  return CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 60);
}

type UploadStep = 'pick' | 'crop' | 'meta' | 'submitting';

interface UploadDraft {
  file: File;
  preview: string;
  isVideo: boolean;
  filename: string;
  alt_text: string;
  caption: string;
  category: GalleryCategory | '';
  sort_order: string;
  status: 'published' | 'draft';
  cropResult: CropResult | null;
}

interface MigrateResult {
  summary: { processed: number; succeeded: number; skipped: number; failed: number };
  results: Array<{ id: string; filename: string; status: string; message?: string }>;
}

export function GalleryClient({ initialItems }: { initialItems: GalleryItemRow[] }) {
  const [items, setItems] = useState<GalleryItemRow[]>(initialItems);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterReview, setFilterReview] = useState<string>('all');
  const [searchQ, setSearchQ] = useState('');
  const [sortBy, setSortBy] = useState<string>('sort_order');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Upload state
  const [uploadStep, setUploadStep] = useState<UploadStep | null>(null);
  const [draft, setDraft] = useState<UploadDraft | null>(null);
  const [uploadError, setUploadError] = useState('');

  // Edit state
  const [editItem, setEditItem] = useState<GalleryItemRow | null>(null);
  const [editFields, setEditFields] = useState<Partial<GalleryItemRow>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [recropping, setRecropping] = useState(false);
  const [recropResult, setRecropResult] = useState<CropResult | null>(null);
  const [recropSaving, setRecropSaving] = useState(false);

  // Delete + bulk
  const [deleteItem, setDeleteItem] = useState<GalleryItemRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkCategoryModal, setBulkCategoryModal] = useState(false);
  const [bulkNewCategory, setBulkNewCategory] = useState<GalleryCategory | ''>('');

  // Approve
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Migrate-crops
  const [migrateConfirm, setMigrateConfirm] = useState(false);
  const [migrateRunning, setMigrateRunning] = useState(false);
  const [migrateResult, setMigrateResult] = useState<MigrateResult | null>(null);

  const filtered = items.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterReview === 'needs_review' && !item.needs_review) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      if (!item.filename.toLowerCase().includes(q) && !item.alt_text.toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'uploaded_at_asc') return new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
    if (sortBy === 'uploaded_at_desc') return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
    return a.sort_order - b.sort_order || new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());
  const selectAll = () => setSelected(new Set(filtered.map((i) => i.id)));

  const reloadItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/gallery?limit=200');
      if (res.ok) setItems(await res.json());
    } catch { /* ignore */ }
  }, []);

  // ── Upload flow ────────────────────────────────────────────────────────
  const openUpload = () => {
    setUploadStep('pick');
    setDraft(null);
    setUploadError('');
  };
  const closeUpload = () => {
    if (draft?.preview) URL.revokeObjectURL(draft.preview);
    setUploadStep(null);
    setDraft(null);
    setUploadError('');
  };

  const handleFilePick = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      setUploadError('Only image or video files are supported.');
      return;
    }
    if (isImage && file.size > MAX_IMAGE_BYTES) {
      setUploadError('Image too large. Maximum size is 5 MB. Please compress and try again.');
      return;
    }
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      setUploadError('Video too large. Maximum size is 25 MB.');
      return;
    }

    const preview = URL.createObjectURL(file);
    setDraft({
      file,
      preview,
      isVideo,
      filename: slugify(file.name),
      alt_text: '',
      caption: '',
      category: '',
      sort_order: '0',
      status: 'published',
      cropResult: null,
    });
    setUploadError('');
    setUploadStep(isVideo ? 'meta' : 'crop');
  };

  const handleCropComplete = useCallback((result: CropResult) => {
    setDraft((d) => (d ? { ...d, cropResult: result } : d));
  }, []);

  const submitUpload = async () => {
    if (!draft) return;
    if (draft.alt_text.trim().length < 10) {
      setUploadError('Alt text must be at least 10 characters.');
      return;
    }
    if (!draft.category) {
      setUploadError('Category is required.');
      return;
    }
    if (!draft.isVideo && !draft.cropResult) {
      setUploadError('Crop the image before submitting.');
      return;
    }

    setUploadStep('submitting');
    setUploadError('');
    const fd = new FormData();
    fd.append('file', draft.file);
    fd.append('filename', draft.filename);
    fd.append('alt_text', draft.alt_text);
    fd.append('caption', draft.caption);
    fd.append('category', draft.category);
    fd.append('sort_order', draft.sort_order);
    fd.append('status', draft.status);
    if (draft.cropResult) {
      fd.append('croppedAreaPixels', JSON.stringify(draft.cropResult.pixels));
      fd.append('zoom', String(draft.cropResult.zoom));
      fd.append('rotation', String(draft.cropResult.rotation));
    }

    let res: Response;
    try {
      res = await fetch('/api/admin/gallery/upload', { method: 'POST', body: fd });
    } catch {
      setUploadError('Network error. Check your connection.');
      setUploadStep('meta');
      return;
    }

    if (res.ok) {
      await reloadItems();
      closeUpload();
      return;
    }

    let serverMessage: string | null = null;
    try {
      const json = (await res.json()) as { error?: unknown };
      if (typeof json.error === 'string') serverMessage = json.error;
    } catch {
      // Platform-level errors (e.g. Next/Vercel 413) return non-JSON bodies.
    }

    let message: string;
    if (res.status === 413) {
      message = 'Image too large. Maximum size is 5 MB. Please compress and try again.';
    } else if (res.status === 401 || res.status === 403) {
      message = "You don't have permission to upload.";
    } else if (res.status >= 500) {
      message = 'Server error. Please try again.';
    } else if (res.status === 400) {
      message = serverMessage ?? 'Upload failed. Please check your input.';
    } else {
      message = serverMessage ?? `Upload failed (status ${res.status}).`;
    }

    setUploadError(message);
    setUploadStep('meta');
  };

  // ── Edit + Re-crop ─────────────────────────────────────────────────────
  const openEdit = (item: GalleryItemRow) => {
    setEditItem(item);
    setEditFields({
      filename: item.filename,
      alt_text: item.alt_text,
      caption: item.caption ?? '',
      category: item.category,
      sort_order: item.sort_order,
      status: item.status,
    });
    setRecropping(false);
    setRecropResult(null);
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    setEditSaving(true);
    const res = await fetch(`/api/admin/gallery/${editItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFields),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => i.id === editItem.id ? updated : i));
      setEditItem(null);
    }
    setEditSaving(false);
  };

  const handleRecropSave = async () => {
    if (!editItem || !recropResult) return;
    setRecropSaving(true);
    const res = await fetch(`/api/admin/gallery/${editItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        croppedAreaPixels: recropResult.pixels,
        zoom: recropResult.zoom,
        rotation: recropResult.rotation,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => i.id === editItem.id ? updated : i));
      setRecropping(false);
      setRecropResult(null);
      setEditItem(updated);
    }
    setRecropSaving(false);
  };

  // ── Approve ────────────────────────────────────────────────────────────
  const handleApprove = async (item: GalleryItemRow) => {
    setApprovingId(item.id);
    const res = await fetch(`/api/admin/gallery/${item.id}/approve`, { method: 'POST' });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => i.id === item.id ? updated : i));
    }
    setApprovingId(null);
  };

  // ── Delete + bulk ──────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeletingId(deleteItem.id);
    await fetch(`/api/admin/gallery/${deleteItem.id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
    setDeleteItem(null);
    setDeletingId(null);
  };

  const handleBulkDelete = async () => {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} items? This cannot be undone.`)) return;
    await fetch('/api/admin/gallery/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    setItems((prev) => prev.filter((i) => !selected.has(i.id)));
    clearSelection();
  };

  const handleBulkCategory = async () => {
    if (!bulkNewCategory) return;
    await fetch('/api/admin/gallery/bulk-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected), category: bulkNewCategory }),
    });
    await reloadItems();
    clearSelection();
    setBulkCategoryModal(false);
    setBulkNewCategory('');
  };

  // ── Migrate-crops ──────────────────────────────────────────────────────
  const runMigrate = async () => {
    setMigrateRunning(true);
    setMigrateResult(null);
    try {
      const res = await fetch('/api/admin/gallery/migrate-crops', { method: 'POST' });
      const json = (await res.json()) as MigrateResult;
      setMigrateResult(json);
      await reloadItems();
    } catch {
      setMigrateResult({ summary: { processed: 0, succeeded: 0, skipped: 0, failed: 0 }, results: [] });
    }
    setMigrateRunning(false);
  };

  const needsReviewCount = items.filter((i) => i.needs_review).length;

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 font-body text-sm"
        >
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 font-body text-sm"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 font-body text-sm"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={filterReview}
          onChange={(e) => setFilterReview(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 font-body text-sm"
        >
          <option value="all">All Items</option>
          <option value="needs_review">Needs Review ({needsReviewCount})</option>
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)]" />
          <input
            type="search"
            placeholder="Search filename or alt text…"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2 pl-9 pr-3 font-body text-sm"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 font-body text-sm"
        >
          <option value="sort_order">Custom Order</option>
          <option value="uploaded_at_desc">Recent First</option>
          <option value="uploaded_at_asc">Oldest First</option>
        </select>
        <button
          onClick={() => setMigrateConfirm(true)}
          className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 font-body text-sm hover:bg-[var(--color-cream)]"
          title="Auto-crop existing items to 4:3"
        >
          <RefreshCcw className="h-4 w-4" /> Migrate Crops
        </button>
        <button
          onClick={openUpload}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-gold-accent)] px-5 py-2.5 font-body text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Upload New
        </button>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] px-4 py-3">
          <span className="font-body text-sm font-medium text-[var(--color-charcoal)]">{selected.size} selected</span>
          <button onClick={handleBulkDelete} className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 font-body text-xs font-medium text-white hover:bg-red-600">
            <Trash2 className="h-3.5 w-3.5" /> Delete Selected
          </button>
          <button onClick={() => setBulkCategoryModal(true)} className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 font-body text-xs font-medium hover:bg-gray-50">
            <ChevronDown className="h-3.5 w-3.5" /> Change Category
          </button>
          <button onClick={selectAll} className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 font-body text-xs hover:bg-gray-50">Select All ({filtered.length})</button>
          <button onClick={clearSelection} className="ml-auto rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 font-body text-xs hover:bg-gray-50">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-white py-24 text-center">
          <Images className="mb-4 h-10 w-10 text-[var(--color-muted)]" />
          <p className="font-display text-xl text-[var(--color-charcoal)]">No gallery items yet</p>
          <p className="mt-2 font-body text-sm text-[var(--color-muted)]">Upload your first photo or video to get started.</p>
          <button onClick={openUpload} className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--color-gold-accent)] px-5 py-2.5 font-body text-sm font-medium text-white hover:opacity-90">
            <Plus className="h-4 w-4" /> Upload New
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => {
            const isSelected = selected.has(item.id);
            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-xl border bg-white transition ${isSelected ? 'border-[var(--color-gold-accent)] ring-2 ring-[var(--color-gold-accent)]/30' : 'border-[var(--color-border)] hover:shadow-md'}`}
              >
                <button
                  onClick={() => toggleSelect(item.id)}
                  className="absolute left-2 top-2 z-10 rounded-md bg-white/90 p-1 opacity-0 shadow transition group-hover:opacity-100 data-[selected=true]:opacity-100"
                  data-selected={isSelected}
                  aria-label={isSelected ? 'Deselect' : 'Select'}
                >
                  {isSelected ? <CheckSquare className="h-4 w-4 text-[var(--color-gold-accent)]" /> : <Square className="h-4 w-4 text-[var(--color-muted)]" />}
                </button>

                <div className={`relative overflow-hidden bg-warm-beige/30 ${item.type === 'video' ? 'aspect-video' : 'aspect-[4/3]'}`}>
                  {item.r2_url ? (
                    <Image src={item.thumbnail_url ?? item.r2_url} alt={item.alt_text} fill sizes="(max-width:640px) 50vw,25vw" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><Images className="h-8 w-8 text-[var(--color-muted)]" /></div>
                  )}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="h-8 w-8 text-white drop-shadow" />
                    </div>
                  )}
                  {item.status === 'draft' && (
                    <span className="absolute right-2 top-2 rounded-full bg-gray-700/80 px-2 py-0.5 font-body text-[10px] text-white">Draft</span>
                  )}
                  {item.needs_review && (
                    <span className="absolute left-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 font-body text-[10px] font-semibold text-amber-900">
                      <AlertTriangle className="h-3 w-3" /> Needs Review
                    </span>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                    {item.needs_review && (
                      <button
                        onClick={() => handleApprove(item)}
                        disabled={approvingId === item.id}
                        className="rounded-lg bg-emerald-500 p-2 text-white hover:bg-emerald-600 disabled:opacity-50"
                        aria-label="Approve crop"
                      >
                        {approvingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </button>
                    )}
                    <button onClick={() => openEdit(item)} className="rounded-lg bg-white/90 p-2 hover:bg-white" aria-label="Edit">
                      <Pencil className="h-4 w-4 text-[var(--color-charcoal)]" />
                    </button>
                    <button onClick={() => setDeleteItem(item)} className="rounded-lg bg-white/90 p-2 hover:bg-white" aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5">
                  <p className="truncate font-body text-xs font-medium text-[var(--color-charcoal)]">{item.filename}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 font-body text-[10px] font-medium ${getCategoryColor(item.category)}`}>{getCategoryLabel(item.category)}</span>
                    <span className="font-body text-[10px] text-[var(--color-muted)]">{item.type}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload modal */}
      {uploadStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-white px-6 py-4">
              <h2 className="font-display text-2xl text-[var(--color-charcoal)]">
                {uploadStep === 'pick' && 'Upload to Gallery'}
                {uploadStep === 'crop' && 'Crop Image (4:3)'}
                {(uploadStep === 'meta' || uploadStep === 'submitting') && 'Add Details'}
              </h2>
              <button onClick={closeUpload} className="rounded-lg p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6">
              {uploadStep === 'pick' && (
                <label
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-cream)] p-10 text-center hover:border-[var(--color-gold-accent)]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFilePick(f); }}
                >
                  <CropIcon className="mb-3 h-8 w-8 text-[var(--color-muted)]" />
                  <p className="font-body text-sm font-medium text-[var(--color-charcoal)]">Drop a file or click to browse</p>
                  <p className="mt-1 font-body text-xs text-[var(--color-muted)]">JPG, PNG, WebP up to 5 MB · MP4, WebM up to 25 MB</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                    className="sr-only"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFilePick(f); }}
                  />
                  {uploadError && <p className="mt-3 font-body text-xs text-red-500">{uploadError}</p>}
                </label>
              )}

              {uploadStep === 'crop' && draft && (
                <>
                  <ImageCropper imageSrc={draft.preview} aspect={GALLERY_ASPECT} onComplete={handleCropComplete} />
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setUploadStep('pick')} className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 font-body text-sm hover:bg-gray-50">Back</button>
                    <button
                      onClick={() => setUploadStep('meta')}
                      disabled={!draft.cropResult}
                      className="rounded-xl bg-[var(--color-gold-accent)] px-5 py-2.5 font-body text-sm font-medium text-white disabled:opacity-50"
                    >
                      Next: Details
                    </button>
                  </div>
                </>
              )}

              {(uploadStep === 'meta' || uploadStep === 'submitting') && draft && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block font-body text-xs font-medium">Filename (slug)</label>
                      <input
                        value={draft.filename}
                        onChange={(e) => setDraft({ ...draft, filename: e.target.value })}
                        onBlur={(e) => setDraft({ ...draft, filename: slugify(e.target.value) })}
                        className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-body text-xs font-medium">Category <span className="text-red-500">*</span></label>
                      <select
                        value={draft.category}
                        onChange={(e) => setDraft({ ...draft, category: e.target.value as GalleryCategory })}
                        className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
                      >
                        <option value="">Select…</option>
                        {CATEGORIES.filter((c) => c.value !== 'all').map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block font-body text-xs font-medium">
                      Alt Text <span className="text-red-500">*</span>
                      <span className="ml-1 font-normal text-[var(--color-muted)]">(describe for accessibility &amp; SEO, ≥ 10 chars)</span>
                    </label>
                    <input
                      value={draft.alt_text}
                      onChange={(e) => setDraft({ ...draft, alt_text: e.target.value })}
                      placeholder="Describe the image in detail…"
                      className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-body text-xs font-medium">Caption (optional)</label>
                    <input
                      value={draft.caption}
                      onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
                      className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block font-body text-xs font-medium">Sort Order</label>
                      <input
                        type="number"
                        value={draft.sort_order}
                        onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })}
                        className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-body text-xs font-medium">Status</label>
                      <select
                        value={draft.status}
                        onChange={(e) => setDraft({ ...draft, status: e.target.value as 'published' | 'draft' })}
                        className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                  {uploadError && <p className="font-body text-sm text-red-500">{uploadError}</p>}
                  <div className="flex justify-end gap-3 pt-2">
                    {!draft.isVideo && (
                      <button
                        onClick={() => setUploadStep('crop')}
                        className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 font-body text-sm hover:bg-gray-50"
                      >
                        Back to Crop
                      </button>
                    )}
                    <button
                      onClick={submitUpload}
                      disabled={uploadStep === 'submitting'}
                      className="flex items-center gap-2 rounded-xl bg-[var(--color-gold-accent)] px-5 py-2.5 font-body text-sm font-medium text-white disabled:opacity-50"
                    >
                      {uploadStep === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit modal (with optional re-crop) */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-white px-6 py-4">
              <h2 className="font-display text-2xl text-[var(--color-charcoal)]">
                {recropping ? 'Re-crop Image' : 'Edit Item'}
              </h2>
              <button onClick={() => setEditItem(null)} className="rounded-lg p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6">
              {recropping ? (
                <>
                  <ImageCropper
                    imageSrc={editItem.original_r2_url}
                    aspect={GALLERY_ASPECT}
                    initialZoom={editItem.crop_data?.zoom ?? 1}
                    initialRotation={editItem.crop_data?.rotation ?? 0}
                    onComplete={(r) => setRecropResult(r)}
                  />
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => { setRecropping(false); setRecropResult(null); }}
                      className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 font-body text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRecropSave}
                      disabled={!recropResult || recropSaving}
                      className="flex items-center gap-2 rounded-xl bg-[var(--color-gold-accent)] px-5 py-2.5 font-body text-sm font-medium text-white disabled:opacity-50"
                    >
                      {recropSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      Save New Crop
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Preview + re-crop trigger */}
                  <div className="mb-6 flex items-start gap-4">
                    <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-warm-beige/30">
                      <Image src={editItem.r2_url} alt={editItem.alt_text} fill className="object-cover" sizes="128px" />
                    </div>
                    {editItem.type === 'image' && (
                      <button
                        onClick={() => setRecropping(true)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 font-body text-sm hover:bg-[var(--color-cream)]"
                      >
                        <CropIcon className="h-4 w-4" /> Re-crop
                      </button>
                    )}
                    {editItem.needs_review && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 font-body text-xs font-semibold text-amber-800">
                        <AlertTriangle className="h-3 w-3" /> Needs Review
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'filename', label: 'Filename', type: 'text' },
                      { key: 'alt_text', label: 'Alt Text', type: 'text' },
                      { key: 'caption', label: 'Caption', type: 'text' },
                    ].map(({ key, label, type }) => (
                      <div key={key}>
                        <label className="mb-1 block font-body text-sm font-medium">{label}</label>
                        <input
                          type={type}
                          value={(editFields as Record<string, string>)[key] ?? ''}
                          onChange={(e) => setEditFields((p) => ({ ...p, [key]: e.target.value }))}
                          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block font-body text-sm font-medium">Category</label>
                        <select
                          value={editFields.category ?? ''}
                          onChange={(e) => setEditFields((p) => ({ ...p, category: e.target.value as GalleryCategory }))}
                          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
                        >
                          {CATEGORIES.filter((c) => c.value !== 'all').map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block font-body text-sm font-medium">Status</label>
                        <select
                          value={editFields.status ?? 'published'}
                          onChange={(e) => setEditFields((p) => ({ ...p, status: e.target.value as 'published' | 'draft' }))}
                          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block font-body text-sm font-medium">Sort Order</label>
                      <input
                        type="number"
                        value={editFields.sort_order ?? 0}
                        onChange={(e) => setEditFields((p) => ({ ...p, sort_order: parseInt(e.target.value, 10) }))}
                        className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {!recropping && (
              <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
                <button onClick={() => setEditItem(null)} className="rounded-xl border border-[var(--color-border)] px-5 py-2 font-body text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleEditSave} disabled={editSaving} className="flex items-center gap-2 rounded-xl bg-[var(--color-forest-green)] px-5 py-2 font-body text-sm font-medium text-white disabled:opacity-50">
                  {editSaving && <Loader2 className="h-4 w-4 animate-spin" />} Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="font-display text-2xl text-[var(--color-charcoal)]">Delete &ldquo;{deleteItem.filename}&rdquo;?</h2>
              <p className="mt-2 font-body text-sm text-[var(--color-muted)]">This will permanently remove the file from R2 and your gallery. This cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
              <button onClick={() => setDeleteItem(null)} className="rounded-xl border border-[var(--color-border)] px-5 py-2 font-body text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} disabled={deletingId === deleteItem.id} className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 font-body text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">
                {deletingId === deleteItem.id && <Loader2 className="h-4 w-4 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Category Modal */}
      {bulkCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="font-display text-xl text-[var(--color-charcoal)]">Change Category</h2>
              <button onClick={() => setBulkCategoryModal(false)} className="rounded-lg p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <select value={bulkNewCategory} onChange={(e) => setBulkNewCategory(e.target.value as GalleryCategory)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm">
                <option value="">Select category…</option>
                {CATEGORIES.filter((c) => c.value !== 'all').map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
              <button onClick={() => setBulkCategoryModal(false)} className="rounded-xl border border-[var(--color-border)] px-5 py-2 font-body text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleBulkCategory} disabled={!bulkNewCategory} className="rounded-xl bg-[var(--color-forest-green)] px-5 py-2 font-body text-sm font-medium text-white disabled:opacity-50">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Migrate Crops Modal */}
      {migrateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <RefreshCcw className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="font-display text-2xl text-[var(--color-charcoal)]">Migrate Existing Crops</h2>
              <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
                Auto-crops all existing image items to 4:3 centre crops and marks them &ldquo;Needs Review&rdquo;.
                Items already cropped are skipped. This is safe to run more than once but does not undo previous runs.
              </p>

              {migrateResult && (
                <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] p-4 font-body text-sm">
                  <p className="font-medium text-[var(--color-charcoal)]">Summary</p>
                  <ul className="mt-2 space-y-1 text-[var(--color-muted)]">
                    <li>Processed: {migrateResult.summary.processed}</li>
                    <li>Succeeded: {migrateResult.summary.succeeded}</li>
                    <li>Skipped: {migrateResult.summary.skipped}</li>
                    <li>Failed: {migrateResult.summary.failed}</li>
                  </ul>
                  {migrateResult.summary.failed > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs">View failures</summary>
                      <ul className="mt-2 space-y-1 text-xs text-red-600">
                        {migrateResult.results.filter((r) => r.status === 'failed').map((r) => (
                          <li key={r.id}>{r.filename}: {r.message}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
              <button onClick={() => { setMigrateConfirm(false); setMigrateResult(null); }} className="rounded-xl border border-[var(--color-border)] px-5 py-2 font-body text-sm hover:bg-gray-50">
                Close
              </button>
              <button
                onClick={runMigrate}
                disabled={migrateRunning}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 font-body text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
              >
                {migrateRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                {migrateRunning ? 'Processing…' : migrateResult ? 'Run Again' : 'Start Migration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

