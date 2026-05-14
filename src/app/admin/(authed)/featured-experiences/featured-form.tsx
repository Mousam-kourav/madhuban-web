'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Crop as CropIcon, Upload, X, AlertTriangle } from 'lucide-react';
import { ImageCropper, type CropResult } from '@/components/admin/ImageCropper';
import { readImageDimensions } from '@/lib/admin/read-image-dimensions';
import type { FeaturedExperienceRow } from '@/lib/featured-experiences/queries';

const FEATURED_ASPECT = 16 / 9;
const DESC_LIMIT = 200;

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .slice(0, 80);
}

function isValidCtaLink(link: string): boolean {
  return link.startsWith('/') || link.startsWith('https://');
}

interface Props {
  initial?: FeaturedExperienceRow;
}

export function FeaturedForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [ctaLabel, setCtaLabel] = useState(initial?.cta_label ?? '');
  const [ctaLink, setCtaLink] = useState(initial?.cta_link ?? '');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order?.toString() ?? '0');
  const [status, setStatus] = useState<'published' | 'draft'>(initial?.status ?? 'draft');

  // Image state
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [cropResult, setCropResult] = useState<CropResult | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [recropPixels, setRecropPixels] = useState<CropResult | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugTouched) setSlug(slugify(val));
  };

  const handleFilePick = async (f: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      setError('Use JPG, PNG, or WebP.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File exceeds 5 MB limit.');
      return;
    }

    let dims: { width: number; height: number };
    try {
      dims = await readImageDimensions(f);
    } catch {
      setError('Could not read image dimensions. Please try a different file.');
      return;
    }
    if (dims.width / dims.height < FEATURED_ASPECT) {
      setError(
        'Featured Experiences require wide landscape images (16:9 or wider, like a cinematic banner). This image is too tall. If you have a 4:3 landscape photo, upload it to the Gallery instead.',
      );
      return;
    }

    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
    setCropResult(null);
    setShowCropper(true);
    setError('');
  };

  const ctaLinkOk = ctaLink === '' || isValidCtaLink(ctaLink);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!title.trim()) { setError('Title is required.'); return; }
    if (!description.trim()) { setError('Description is required.'); return; }
    if (description.length > DESC_LIMIT) { setError(`Description must be ≤ ${DESC_LIMIT} characters.`); return; }
    if (!ctaLabel.trim()) { setError('CTA label is required.'); return; }
    if (!ctaLink.trim()) { setError('CTA link is required.'); return; }

    setSaving(true);

    try {
      if (!isEdit) {
        if (!file || !cropResult) {
          setError('Upload and crop an image before saving.');
          setSaving(false);
          return;
        }
        const effectiveSlug = slug || slugify(title);

        // Step 1: presign
        const presignRes = await fetch('/api/admin/featured-experiences/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            slug: effectiveSlug,
            mimeType: file.type,
            fileSize: file.size,
          }),
        });
        if (!presignRes.ok) {
          const j = await presignRes.json().catch(() => ({} as { error?: string }));
          setError(j?.error ?? `Failed to prepare upload (status ${presignRes.status}).`);
          setSaving(false);
          return;
        }
        const { uploadUrl, r2Key } = (await presignRes.json()) as { uploadUrl: string; r2Key: string };

        // Step 2: PUT directly to R2
        const putRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!putRes.ok) {
          setError(`Upload to storage failed (status ${putRes.status}).`);
          setSaving(false);
          return;
        }

        // Step 3: POST metadata
        const res = await fetch('/api/admin/featured-experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            r2Key,
            slug: effectiveSlug,
            title: title.trim(),
            description: description.trim(),
            cta_label: ctaLabel.trim(),
            cta_link: ctaLink.trim(),
            sort_order: parseInt(sortOrder, 10) || 0,
            status,
            mimeType: file.type,
            fileSize: file.size,
            croppedAreaPixels: cropResult.pixels,
            zoom: cropResult.zoom,
            rotation: cropResult.rotation,
          }),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error ?? 'Save failed'); setSaving(false); return; }
        router.push('/admin/featured-experiences');
        router.refresh();
        return;
      }

      // Edit path — metadata-only PATCH (re-crop is a separate flow)
      const payload: Record<string, unknown> = {
        slug: slug || slugify(title),
        title: title.trim(),
        description: description.trim(),
        cta_label: ctaLabel.trim(),
        cta_link: ctaLink.trim(),
        sort_order: parseInt(sortOrder, 10) || 0,
        status,
      };
      if (recropPixels) {
        payload.croppedAreaPixels = recropPixels.pixels;
        payload.zoom = recropPixels.zoom;
        payload.rotation = recropPixels.rotation;
      }
      const res = await fetch(`/api/admin/featured-experiences/${initial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? 'Save failed'); setSaving(false); return; }
      router.push('/admin/featured-experiences');
      router.refresh();
    } catch {
      setError('Network error');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title + slug */}
      <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
        <div>
          <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            maxLength={120}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
            Slug
          </label>
          <input
            value={slug}
            onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-mono text-sm"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
          Description <span className="text-red-500">*</span>
          <span className="ml-2 font-normal text-[var(--color-muted)]">
            {description.length}/{DESC_LIMIT}
          </span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, DESC_LIMIT))}
          rows={2}
          maxLength={DESC_LIMIT}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
        />
      </div>

      {/* Image */}
      <div>
        <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
          Image (16:9) {!isEdit && <span className="text-red-500">*</span>}
        </label>

        {isEdit && initial && !showCropper && (
          <div className="mb-3 flex items-start gap-4">
            <div className="relative aspect-[16/9] w-72 overflow-hidden rounded-xl bg-warm-beige/30">
              <Image src={initial.r2_url} alt={initial.title} fill className="object-cover" sizes="288px" />
            </div>
            <button
              type="button"
              onClick={() => { setRecropPixels(null); setShowCropper(true); setFilePreview(initial.original_r2_url); }}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 font-body text-sm hover:bg-[var(--color-cream)]"
            >
              <CropIcon className="h-4 w-4" /> Re-crop original
            </button>
          </div>
        )}

        {!isEdit && file && filePreview && !showCropper && cropResult && (
          <div className="mb-3 flex items-start gap-4">
            <div className="relative aspect-[16/9] w-72 overflow-hidden rounded-xl bg-warm-beige/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={filePreview} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => setShowCropper(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 font-body text-sm hover:bg-[var(--color-cream)]"
            >
              <CropIcon className="h-4 w-4" /> Adjust crop
            </button>
          </div>
        )}

        {showCropper && filePreview && (
          <div className="mb-3 space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] p-4">
            <ImageCropper
              imageSrc={filePreview}
              aspect={FEATURED_ASPECT}
              initialZoom={isEdit && initial?.crop_data ? initial.crop_data.zoom : 1}
              initialRotation={isEdit && initial?.crop_data ? initial.crop_data.rotation : 0}
              onComplete={(r) => {
                if (isEdit) setRecropPixels(r);
                else setCropResult(r);
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCropper(false);
                  if (isEdit) setRecropPixels(null);
                }}
                className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 font-body text-sm hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowCropper(false)}
                disabled={isEdit ? !recropPixels : !cropResult}
                className="rounded-xl bg-[var(--color-forest-green)] px-4 py-2 font-body text-sm font-medium text-white disabled:opacity-50"
              >
                Use this crop
              </button>
            </div>
          </div>
        )}

        {!isEdit && !file && (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-cream)] p-8 text-center hover:border-[var(--color-forest-green)]">
            <Upload className="mb-2 h-7 w-7 text-[var(--color-muted)]" />
            <p className="font-body text-sm font-medium text-[var(--color-charcoal)]">
              Drop a 16:9 image or click to browse
            </p>
            <p className="mt-1 font-body text-xs text-[var(--color-muted)]">
              JPG, PNG, WebP up to 5 MB. You will crop in the next step.
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFilePick(f); }}
            />
          </label>
        )}

        {!isEdit && file && (
          <button
            type="button"
            onClick={() => {
              if (filePreview) URL.revokeObjectURL(filePreview);
              setFile(null);
              setFilePreview('');
              setCropResult(null);
              setShowCropper(false);
            }}
            className="mt-2 inline-flex items-center gap-1 font-body text-xs text-red-500 hover:underline"
          >
            <X className="h-3 w-3" /> Remove image
          </button>
        )}
      </div>

      {/* CTA */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
            CTA Label <span className="text-red-500">*</span>
          </label>
          <input
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            placeholder="Book Now"
            maxLength={40}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
            CTA Link <span className="text-red-500">*</span>
          </label>
          <input
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            placeholder="/day-outing or https://..."
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
          />
          {!ctaLinkOk && (
            <p className="mt-1 inline-flex items-center gap-1 font-body text-xs text-amber-700">
              <AlertTriangle className="h-3 w-3" />
              Link should start with / or https:// — you can still save, but it may be invalid.
            </p>
          )}
        </div>
      </div>

      {/* Sort + status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
            Sort Order
          </label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 font-body text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {error && <p className="font-body text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-6">
        <button
          type="button"
          onClick={() => router.push('/admin/featured-experiences')}
          className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 font-body text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-forest-green)] px-5 py-2.5 font-body text-sm font-medium text-white disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? 'Save Changes' : 'Create Experience'}
        </button>
      </div>
    </form>
  );
}
