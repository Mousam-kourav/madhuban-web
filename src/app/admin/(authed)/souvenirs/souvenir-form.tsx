'use client';

import { useState, useRef, type FormEvent, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/souvenirs/categories';
import type { DbSouvenir } from '@/lib/souvenirs/types';

interface Props {
  initial?: DbSouvenir;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

type UploadSlot = 1 | 2 | 3;

const labelCls =
  'mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal';

interface ImageUploadSlotProps {
  value: string;
  label: string;
  isUploading: boolean;
  disabled?: boolean;
  fileRef: RefObject<HTMLInputElement | null>;
  onClear: () => void;
  onFileChange: (f: File) => void;
}

function ImageUploadSlot({ value, label, isUploading, disabled, fileRef, onClear, onFileChange }: ImageUploadSlotProps) {
  return (
    <div>
      <p className={labelCls}>{label}</p>
      {value ? (
        <div className="relative w-32 overflow-hidden rounded-xl border border-[var(--color-border)]">
          <Image
            src={value}
            alt={label}
            width={128}
            height={128}
            className="aspect-square object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 text-[var(--color-charcoal)] hover:bg-white"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading || disabled}
          className="flex h-20 w-32 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-earth-brown)]/50 hover:text-[var(--color-earth-brown)] transition-colors disabled:pointer-events-none disabled:opacity-40"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          <span className="font-body text-xs">Upload</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileChange(f);
        }}
      />
    </div>
  );
}


export function SouvenirForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugManual, setSlugManual] = useState(!!initial);
  const [category, setCategory] = useState(initial?.category ?? 'general');
  const [shortDesc, setShortDesc] = useState(initial?.short_description ?? '');
  const [longDesc, setLongDesc] = useState(initial?.long_description ?? '');
  const [price, setPrice] = useState(initial?.price?.toString() ?? '');
  const [showPrice, setShowPrice] = useState(initial?.show_price ?? true);
  const [coverImage, setCoverImage] = useState(initial?.cover_image ?? '');
  const [detailImage2, setDetailImage2] = useState(initial?.detail_image_2 ?? '');
  const [detailImage3, setDetailImage3] = useState(initial?.detail_image_3 ?? '');
  const [artisanCredit, setArtisanCredit] = useState(initial?.artisan_credit ?? '');
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order?.toString() ?? '0');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState<UploadSlot | null>(null);

  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const fileRef3 = useRef<HTMLInputElement>(null);

  function handleNameChange(val: string) {
    setName(val);
    if (!slugManual) setSlug(slugify(val));
  }

  async function uploadImage(slot: UploadSlot, file: File) {
    const currentSlug = slug || slugify(name);
    if (!currentSlug) {
      setError('Enter a name/slug before uploading images.');
      return;
    }

    setUploading(slot);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', `souvenir-shop/products/${currentSlug}/img-${slot}`);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setError(json.error ?? 'Upload failed');
        return;
      }
      if (slot === 1) setCoverImage(json.url);
      if (slot === 2) setDetailImage2(json.url);
      if (slot === 3) setDetailImage3(json.url);
    } catch {
      setError('Upload failed — check network');
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required.'); return; }
    if (!slug.trim()) { setError('Slug is required.'); return; }
    if (!category) { setError('Category is required.'); return; }
    if (!coverImage) { setError('Cover image is required.'); return; }

    setSaving(true);
    setError('');

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      category,
      shortDescription: shortDesc.trim() || null,
      longDescription: longDesc.trim() || null,
      price: price ? parseInt(price, 10) : null,
      showPrice,
      coverImage: coverImage || null,
      detailImage2: detailImage2 || null,
      detailImage3: detailImage3 || null,
      artisanCredit: artisanCredit.trim() || null,
      isActive,
      sortOrder: parseInt(sortOrder, 10) || 0,
    };

    const url = isEdit ? `/api/admin/souvenirs/${initial.id}` : '/api/admin/souvenirs';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Save failed');
        return;
      }
      router.push('/admin/souvenirs');
    } catch {
      setError('Save failed — check network');
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    'h-10 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 font-body text-sm text-[var(--color-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/40';

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      {error && (
        <div
          className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 px-4 py-3 font-body text-sm text-[var(--color-error)]"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Name + Slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sv-name" className={labelCls}>
            Name *
          </label>
          <input
            id="sv-name"
            type="text"
            className={inputCls}
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Gond Painting — Small"
            autoFocus={!isEdit}
            required
          />
        </div>
        <div>
          <label htmlFor="sv-slug" className={labelCls}>
            Slug *
          </label>
          <input
            id="sv-slug"
            type="text"
            className={inputCls}
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(e.target.value);
            }}
            placeholder="gond-painting-small"
            required
          />
          {isEdit && (
            <p className="mt-1 font-body text-xs text-[var(--color-muted)]">
              Note: changing slug after images are uploaded won&#39;t move image files. Re-upload if needed.
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="sv-cat" className={labelCls}>
          Category *
        </label>
        <select
          id="sv-cat"
          className={`${inputCls} appearance-none`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Short description */}
      <div>
        <label htmlFor="sv-short" className={labelCls}>
          Short Description <span className="normal-case text-[var(--color-muted)]">(shown on cards, ~120 chars)</span>
        </label>
        <textarea
          id="sv-short"
          rows={2}
          maxLength={200}
          className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 font-body text-sm text-[var(--color-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/40"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          placeholder="One or two sentences. Shown on the listing card."
        />
        <p className="mt-0.5 text-right font-body text-xs text-[var(--color-muted)]">
          {shortDesc.length}/200
        </p>
      </div>

      {/* Long description */}
      <div>
        <label htmlFor="sv-long" className={labelCls}>
          Long Description <span className="normal-case text-[var(--color-muted)]">(shown on detail page)</span>
        </label>
        <textarea
          id="sv-long"
          rows={5}
          className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 font-body text-sm text-[var(--color-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/40"
          value={longDesc}
          onChange={(e) => setLongDesc(e.target.value)}
          placeholder="Full product description. Supports plain text paragraphs."
        />
      </div>

      {/* Price + Show price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sv-price" className={labelCls}>
            Price (INR) <span className="normal-case text-[var(--color-muted)]">— leave blank if not set</span>
          </label>
          <input
            id="sv-price"
            type="number"
            min={0}
            className={inputCls}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 450"
          />
        </div>
        <div className="flex flex-col justify-end gap-1">
          <label className={labelCls}>
            Show Price?
            <span className="ml-1 normal-case font-normal text-[var(--color-muted)]">
              Off = display &quot;Ask for price&quot;
            </span>
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={showPrice}
            onClick={() => setShowPrice((p) => !p)}
            className={`relative h-6 w-11 overflow-hidden rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-earth-brown)] ${
              showPrice ? 'bg-[var(--color-earth-brown)]' : 'bg-[var(--color-border)]'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                showPrice ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Images */}
      <div>
        <p className={labelCls}>Images</p>
        {!name.trim() && (
          <p className="mb-3 font-body text-xs italic text-[var(--color-earth-brown)]">
            Enter a product name above to enable image upload.
          </p>
        )}
        <div className="flex flex-wrap gap-4">
          <ImageUploadSlot
            value={coverImage}
            label="Cover *"
            isUploading={uploading === 1}
            disabled={!name.trim()}
            fileRef={fileRef1}
            onClear={() => setCoverImage('')}
            onFileChange={(f) => void uploadImage(1, f)}
          />
          <ImageUploadSlot
            value={detailImage2}
            label="Image 2"
            isUploading={uploading === 2}
            disabled={!name.trim()}
            fileRef={fileRef2}
            onClear={() => setDetailImage2('')}
            onFileChange={(f) => void uploadImage(2, f)}
          />
          <ImageUploadSlot
            value={detailImage3}
            label="Image 3"
            isUploading={uploading === 3}
            disabled={!name.trim()}
            fileRef={fileRef3}
            onClear={() => setDetailImage3('')}
            onFileChange={(f) => void uploadImage(3, f)}
          />
        </div>
      </div>

      {/* Artisan credit */}
      <div>
        <label htmlFor="sv-artisan" className={labelCls}>
          Artisan Credit <span className="normal-case text-[var(--color-muted)]">(optional)</span>
        </label>
        <input
          id="sv-artisan"
          type="text"
          className={inputCls}
          value={artisanCredit}
          onChange={(e) => setArtisanCredit(e.target.value)}
          placeholder="e.g. Made by Gond artisans, Mandla"
        />
      </div>

      {/* Is active + Sort order */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Active (visible on site)</label>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive((a) => !a)}
            className={`relative h-6 w-11 overflow-hidden rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-earth-brown)] ${
              isActive ? 'bg-[var(--color-earth-brown)]' : 'bg-[var(--color-border)]'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <div>
          <label htmlFor="sv-order" className={labelCls}>
            Sort Order
          </label>
          <input
            id="sv-order"
            type="number"
            min={0}
            className={inputCls}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-6">
        <button
          type="submit"
          disabled={saving}
          className="flex h-10 items-center gap-2 rounded-xl bg-[var(--color-forest-green)] px-6 font-body text-sm font-medium text-[var(--color-ivory)] transition hover:opacity-90 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        <a
          href="/admin/souvenirs"
          className="font-body text-sm text-[var(--color-muted)] hover:text-[var(--color-charcoal)]"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
