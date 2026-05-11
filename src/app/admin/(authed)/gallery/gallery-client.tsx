'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Plus, Search, Pencil, Trash2, Images, Play,
  X, Upload, Loader2, CheckSquare, Square,
  ChevronDown, AlertTriangle,
} from 'lucide-react';
import type { GalleryItemRow, GalleryCategory } from '@/lib/supabase/database.types';

const CATEGORIES: { value: GalleryCategory | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All Categories', color: '' },
  { value: 'stays', label: 'Stays', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'dining', label: 'Dining', color: 'bg-amber-100 text-amber-800' },
  { value: 'aranyashala', label: 'Aranyashala', color: 'bg-green-100 text-green-800' },
  { value: 'forest', label: 'Forest', color: 'bg-teal-100 text-teal-800' },
  { value: 'events', label: 'Events', color: 'bg-purple-100 text-purple-800' },
  { value: 'behind-the-scenes', label: 'Behind the Scenes', color: 'bg-slate-100 text-slate-800' },
];

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

interface UploadItem {
  file: File;
  filename: string;
  alt_text: string;
  caption: string;
  category: GalleryCategory | '';
  sort_order: string;
  status: 'published' | 'draft';
  preview: string;
  progress: 'idle' | 'uploading' | 'done' | 'error';
  errorMsg?: string;
}

export function GalleryClient({ initialItems }: { initialItems: GalleryItemRow[] }) {
  const [items, setItems] = useState<GalleryItemRow[]>(initialItems);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQ, setSearchQ] = useState('');
  const [sortBy, setSortBy] = useState<string>('sort_order');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItemRow | null>(null);
  const [deleteItem, setDeleteItem] = useState<GalleryItemRow | null>(null);
  const [bulkCategoryModal, setBulkCategoryModal] = useState(false);
  const [bulkNewCategory, setBulkNewCategory] = useState<GalleryCategory | ''>('');
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editFields, setEditFields] = useState<Partial<GalleryItemRow>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
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

  // --- Upload flow ---
  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const newItems: UploadItem[] = Array.from(files).map((file) => ({
      file,
      filename: slugify(file.name),
      alt_text: '',
      caption: '',
      category: '',
      sort_order: '0',
      status: 'published',
      preview: URL.createObjectURL(file),
      progress: 'idle',
    }));
    setUploadItems((prev) => [...prev, ...newItems]);
    setShowUploadModal(true);
  };

  const updateUploadItem = (idx: number, patch: Partial<UploadItem>) => {
    setUploadItems((prev) => prev.map((item, i) => i === idx ? { ...item, ...patch } : item));
  };

  const handleUploadAll = async () => {
    const invalid = uploadItems.findIndex((u) => u.alt_text.length < 10 || !u.category);
    if (invalid >= 0) {
      alert('Each item needs a category and alt text (≥ 10 characters).');
      return;
    }
    setUploading(true);
    for (let i = 0; i < uploadItems.length; i++) {
      const u = uploadItems[i];
      if (!u || u.progress === 'done') continue;
      updateUploadItem(i, { progress: 'uploading' });
      const fd = new FormData();
      fd.append('file', u.file);
      fd.append('filename', u.filename);
      fd.append('alt_text', u.alt_text);
      fd.append('caption', u.caption);
      fd.append('category', u.category);
      fd.append('sort_order', u.sort_order);
      fd.append('status', u.status);
      try {
        const res = await fetch('/api/admin/gallery/upload', { method: 'POST', body: fd });
        if (res.ok) {
          updateUploadItem(i, { progress: 'done' });
        } else {
          const err = await res.json();
          updateUploadItem(i, { progress: 'error', errorMsg: err.error ?? 'Upload failed' });
        }
      } catch {
        updateUploadItem(i, { progress: 'error', errorMsg: 'Network error' });
      }
    }
    setUploading(false);
    await reloadItems();
    const allDone = uploadItems.every((u) => u.progress === 'done');
    if (allDone) { setShowUploadModal(false); setUploadItems([]); }
  };

  // --- Delete flow ---
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

  // --- Edit flow ---
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
          onClick={() => setShowUploadModal(true)}
          className="ml-auto flex items-center gap-2 rounded-xl bg-[var(--color-gold-accent)] px-5 py-2.5 font-body text-sm font-medium text-white transition hover:opacity-90"
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
          <button onClick={() => setShowUploadModal(true)} className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--color-gold-accent)] px-5 py-2.5 font-body text-sm font-medium text-white hover:opacity-90">
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
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(item.id)}
                  className="absolute left-2 top-2 z-10 rounded-md bg-white/90 p-1 opacity-0 shadow transition group-hover:opacity-100 data-[selected=true]:opacity-100"
                  data-selected={isSelected}
                  aria-label={isSelected ? 'Deselect' : 'Select'}
                >
                  {isSelected ? <CheckSquare className="h-4 w-4 text-[var(--color-gold-accent)]" /> : <Square className="h-4 w-4 text-[var(--color-muted)]" />}
                </button>

                {/* Thumbnail */}
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
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => openEdit(item)} className="rounded-lg bg-white/90 p-2 hover:bg-white" aria-label="Edit">
                      <Pencil className="h-4 w-4 text-[var(--color-charcoal)]" />
                    </button>
                    <button onClick={() => setDeleteItem(item)} className="rounded-lg bg-white/90 p-2 hover:bg-white" aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Info */}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-white px-6 py-4">
              <h2 className="font-display text-2xl text-[var(--color-charcoal)]">Upload to Gallery</h2>
              <button onClick={() => { setShowUploadModal(false); setUploadItems([]); }} className="rounded-lg p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              {/* Drop zone */}
              <label
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-cream)] p-8 text-center hover:border-[var(--color-gold-accent)] hover:bg-[var(--color-cream)]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFilesSelected(e.dataTransfer.files); }}
              >
                <Upload className="mb-3 h-8 w-8 text-[var(--color-muted)]" />
                <p className="font-body text-sm font-medium text-[var(--color-charcoal)]">Drop files here or click to browse</p>
                <p className="mt-1 font-body text-xs text-[var(--color-muted)]">JPG, PNG, WebP up to 5 MB · MP4, WebM up to 25 MB</p>
                <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" className="sr-only" onChange={(e) => handleFilesSelected(e.target.files)} />
              </label>

              {/* File list */}
              {uploadItems.map((u, idx) => (
                <div key={idx} className="mt-4 rounded-xl border border-[var(--color-border)] p-4">
                  <div className="flex items-start gap-3">
                    {/* Preview */}
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-warm-beige/30">
                      {u.file.type.startsWith('image/') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.preview} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center"><Play className="h-6 w-6 text-[var(--color-muted)]" /></div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block font-body text-xs font-medium text-[var(--color-charcoal)]">Filename (slug)</label>
                          <input
                            value={u.filename}
                            onChange={(e) => updateUploadItem(idx, { filename: e.target.value })}
                            onBlur={(e) => updateUploadItem(idx, { filename: slugify(e.target.value) })}
                            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-1.5 font-body text-xs"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-body text-xs font-medium text-[var(--color-charcoal)]">Category <span className="text-red-500">*</span></label>
                          <select value={u.category} onChange={(e) => updateUploadItem(idx, { category: e.target.value as GalleryCategory })}
                            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-1.5 font-body text-xs">
                            <option value="">Select…</option>
                            {CATEGORIES.filter((c) => c.value !== 'all').map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block font-body text-xs font-medium text-[var(--color-charcoal)]">
                          Alt Text <span className="text-red-500">*</span>
                          <span className="ml-1 font-normal text-[var(--color-muted)]">(describe for accessibility & SEO)</span>
                        </label>
                        <input value={u.alt_text} onChange={(e) => updateUploadItem(idx, { alt_text: e.target.value })}
                          placeholder="Describe the image in detail…"
                          className={`w-full rounded-lg border px-3 py-1.5 font-body text-xs ${u.alt_text && u.alt_text.length < 10 ? 'border-red-400' : 'border-[var(--color-border)]'}`} />
                        {u.alt_text && u.alt_text.length < 10 && <p className="mt-0.5 font-body text-[10px] text-red-500">Must be at least 10 characters</p>}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="mb-1 block font-body text-xs font-medium text-[var(--color-charcoal)]">Caption (optional)</label>
                          <input value={u.caption} onChange={(e) => updateUploadItem(idx, { caption: e.target.value })}
                            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-1.5 font-body text-xs" />
                        </div>
                        <div>
                          <label className="mb-1 block font-body text-xs font-medium text-[var(--color-charcoal)]">Sort Order</label>
                          <input type="number" value={u.sort_order} onChange={(e) => updateUploadItem(idx, { sort_order: e.target.value })}
                            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-1.5 font-body text-xs" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-body text-xs font-medium text-[var(--color-charcoal)]">Status:</span>
                        <button onClick={() => updateUploadItem(idx, { status: u.status === 'published' ? 'draft' : 'published' })}
                          className={`rounded-full px-3 py-1 font-body text-xs font-medium transition ${u.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                          {u.status === 'published' ? 'Published' : 'Draft'}
                        </button>
                        {u.progress === 'error' && <span className="font-body text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" />{u.errorMsg}</span>}
                        {u.progress === 'done' && <span className="font-body text-xs text-emerald-600">✓ Uploaded</span>}
                        {u.progress === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-[var(--color-gold-accent)]" />}
                      </div>
                    </div>
                    <button onClick={() => setUploadItems((prev) => prev.filter((_, i) => i !== idx))} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-4 w-4 text-[var(--color-muted)]" /></button>
                  </div>
                </div>
              ))}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button onClick={() => { setShowUploadModal(false); setUploadItems([]); }} className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 font-body text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleUploadAll} disabled={uploading || !uploadItems.length} className="flex items-center gap-2 rounded-xl bg-[var(--color-gold-accent)] px-5 py-2.5 font-body text-sm font-medium text-white disabled:opacity-50">
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Upload All ({uploadItems.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="font-display text-2xl text-[var(--color-charcoal)]">Edit Item</h2>
              <button onClick={() => setEditItem(null)} className="rounded-lg p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-6">
              {[
                { key: 'filename', label: 'Filename', type: 'text' },
                { key: 'alt_text', label: 'Alt Text', type: 'text' },
                { key: 'caption', label: 'Caption', type: 'text' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="mb-1 block font-body text-sm font-medium text-[var(--color-charcoal)]">{label}</label>
                  <input type={type} value={(editFields as Record<string, string>)[key] ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-body text-sm font-medium text-[var(--color-charcoal)]">Category</label>
                  <select value={editFields.category ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, category: e.target.value as GalleryCategory }))}
                    className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm">
                    {CATEGORIES.filter((c) => c.value !== 'all').map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-body text-sm font-medium text-[var(--color-charcoal)]">Status</label>
                  <select value={editFields.status ?? 'published'} onChange={(e) => setEditFields((p) => ({ ...p, status: e.target.value as 'published' | 'draft' }))}
                    className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block font-body text-sm font-medium text-[var(--color-charcoal)]">Sort Order</label>
                <input type="number" value={editFields.sort_order ?? 0} onChange={(e) => setEditFields((p) => ({ ...p, sort_order: parseInt(e.target.value, 10) }))}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
              <button onClick={() => setEditItem(null)} className="rounded-xl border border-[var(--color-border)] px-5 py-2 font-body text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleEditSave} disabled={editSaving} className="flex items-center gap-2 rounded-xl bg-[var(--color-forest-green)] px-5 py-2 font-body text-sm font-medium text-white disabled:opacity-50">
                {editSaving && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </button>
            </div>
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
    </div>
  );
}
