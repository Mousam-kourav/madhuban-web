"use client";

import { useState, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Pencil,
  Link2 as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { PostToolbar } from "./post-toolbar";
import { PostSidebar } from "./post-sidebar";
import type { BlogPost, BlogStatus, TiptapDoc } from "@/lib/blog/types";

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
  const mins = Math.floor(diff / 60);
  return `Saved ${mins} min ago`;
}

interface Props {
  post?: BlogPost;
}

export function PostEditor({ post }: Props) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!post?.slug);
  const [status, setStatus] = useState<BlogStatus>(post?.status ?? "draft");
  const [category, setCategory] = useState(post?.category ?? "");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    post?.meta_description ?? "",
  );
  const [coverImage, setCoverImage] = useState<string | null>(
    post?.cover_image_url ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(post?.id ?? null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, linkOnPaste: true, autolink: true }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder: "Start writing your story…" }),
    ],
    content: (post?.body as TiptapDoc) ?? undefined,
    editorProps: {
      attributes: {
        class:
          "outline-none prose max-w-none font-body text-lg text-[var(--color-charcoal)] leading-relaxed min-h-[60vh] pt-6",
      },
    },
    onUpdate: () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        void autoSave();
      }, 30000);
    },
  });

  // Slug is derived in the title onChange handler (not via useEffect) to avoid setState-in-effect.

  const buildPayload = useCallback(() => {
    return {
      title: title || "Untitled",
      slug: slug || slugify(title) || `post-${Date.now()}`,
      body: editor?.getJSON() ?? null,
      status,
      category: category || null,
      tags: tags.length ? tags : null,
      seo_title: seoTitle || null,
      meta_description: metaDescription || null,
      cover_image_url: coverImage,
    };
  }, [
    title,
    slug,
    editor,
    status,
    category,
    tags,
    seoTitle,
    metaDescription,
    coverImage,
  ]);

  const autoSave = useCallback(async () => {
    if (!title && !editor?.getText()) return;
    setSaving(true);
    setSaveError(null);

    try {
      if (postId) {
        const res = await fetch(`/api/admin/posts/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
        if (!res.ok) throw new Error("Save failed");
      } else {
        const res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
        if (!res.ok) {
          const err = (await res.json()) as { error?: string };
          throw new Error(err.error ?? "Create failed");
        }
        const data = (await res.json()) as { id: string };
        setPostId(data.id);
        router.replace(`/admin/posts/${data.id}/edit`);
      }
      setLastSaved(new Date());
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [postId, buildPayload, editor, title, router]);

  async function handleSaveDraft() {
    setStatus("draft");
    await autoSave();
  }

  async function handlePublish() {
    setStatus("published");
    setSaving(true);
    setSaveError(null);
    const payload = { ...buildPayload(), status: "published" as BlogStatus };
    try {
      if (postId) {
        const res = await fetch(`/api/admin/posts/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Publish failed");
      } else {
        const res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Publish failed");
        const data = (await res.json()) as { id: string };
        setPostId(data.id);
        router.replace(`/admin/posts/${data.id}/edit`);
      }
      setLastSaved(new Date());
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (!res.ok) throw new Error("Upload failed");
    const data = (await res.json()) as { url: string; alt: string };
    return data.url;
  }

  function openImageDialog() {
    imageInputRef.current?.click();
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await handleImageUpload(file);
      editor?.chain().focus().setImage({ src: url, alt: "" }).run();
    } catch {
      setSaveError("Image upload failed");
    }
    e.target.value = "";
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await handleImageUpload(file);
      setCoverImage(url);
    } catch {
      setSaveError("Cover upload failed");
    }
    e.target.value = "";
  }

  const bodyText = editor?.getText() ?? "";
  const titleKeyword = title.split(" ")[0] ?? "";
  const hasImages =
    JSON.stringify(editor?.getJSON() ?? {}).includes('"type":"image"');

  return (
    <div className="flex flex-col min-h-screen -m-8">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center gap-4 px-6 py-3 bg-white border-b border-[var(--color-border)]">
        <a
          href="/admin/posts"
          className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-charcoal)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body text-sm">Blog Manager</span>
        </a>

        {title && (
          <span className="text-[var(--color-border)]">/</span>
        )}
        {title && (
          <span className="font-body text-sm text-[var(--color-charcoal)] truncate max-w-xs">
            {title}
          </span>
        )}

        <div className="flex-1" />

        {saving ? (
          <span className="font-body text-xs italic text-[var(--color-muted)]">
            Saving…
          </span>
        ) : lastSaved ? (
          <span className="font-body text-xs italic text-[var(--color-muted)]">
            {formatSaveTime(lastSaved)}
          </span>
        ) : null}

        {saveError && (
          <span className="font-body text-xs text-[var(--color-error)]">
            {saveError}
          </span>
        )}

        {postId && (
          <a
            href={`/blog/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-body text-sm text-[var(--color-muted)] hover:text-[var(--color-charcoal)] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview
          </a>
        )}

        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={saving}
          className="px-4 py-2 rounded-xl border border-[var(--color-border)] font-body text-sm text-[var(--color-charcoal)] hover:border-[var(--color-earth-brown)] transition-colors disabled:opacity-50"
        >
          Save Draft
        </button>

        <button
          type="button"
          onClick={handlePublish}
          disabled={saving || !title}
          className="px-4 py-2 rounded-xl bg-[var(--color-gold-accent)] font-body text-sm font-medium text-[var(--color-charcoal)] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Publish
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Main editor column */}
        <div className="flex-1 max-w-3xl mx-auto px-8 py-8 overflow-y-auto">
          {/* Cover image */}
          <div className="mb-8">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              id="cover-upload"
              onChange={handleCoverUpload}
            />
            <label
              htmlFor="cover-upload"
              className="block w-full aspect-video border-2 border-dashed border-[var(--color-border)] rounded-3xl overflow-hidden cursor-pointer hover:border-[var(--color-earth-brown)] transition-colors group"
            >
              {coverImage ? (
                <div className="relative w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="font-body text-sm text-white font-medium">
                      Replace
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[var(--color-muted)]">
                  <Camera className="w-8 h-8" />
                  <p className="font-body text-sm font-medium tracking-wider uppercase text-center">
                    Click to upload featured image
                  </p>
                  <p className="font-body text-xs">
                    Optimal: 1200 × 630 pixels
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            placeholder="Your title…"
            className="w-full font-display italic text-4xl text-[var(--color-charcoal)] placeholder:text-[var(--color-muted)] bg-transparent border-none outline-none mb-4 leading-tight"
          />

          {/* Slug */}
          <div className="flex items-center gap-2 mb-6 group">
            <LinkIcon className="w-3.5 h-3.5 text-[var(--color-muted)] flex-shrink-0" />
            <span className="font-body text-xs text-[var(--color-muted)]">
              /blog/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugEdited(true);
              }}
              className="flex-1 font-body text-xs text-[var(--color-earth-brown)] bg-transparent border-none outline-none focus:bg-[var(--color-cream)] focus:px-2 focus:rounded transition-all"
            />
            <Pencil className="w-3 h-3 text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>

          {/* Toolbar */}
          <PostToolbar editor={editor} onImageUpload={openImageDialog} />

          {/* Hidden image file input for body images */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageFile}
          />

          {/* Editor */}
          <EditorContent editor={editor} />
        </div>

        {/* Right sidebar */}
        <PostSidebar
          status={status}
          category={category}
          tags={tags}
          seoTitle={seoTitle}
          metaDescription={metaDescription}
          bodyText={bodyText}
          titleKeyword={titleKeyword}
          slug={slug}
          hasImages={hasImages}
          onStatusChange={setStatus}
          onCategoryChange={setCategory}
          onTagsChange={setTags}
          onSeoChange={({ seoTitle: st, metaDescription: md }) => {
            setSeoTitle(st);
            setMetaDescription(md);
          }}
        />
      </div>
    </div>
  );
}
