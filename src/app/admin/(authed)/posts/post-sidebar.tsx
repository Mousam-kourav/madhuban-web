"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, Plus } from "lucide-react";
import type { BlogStatus } from "@/lib/blog/types";

interface SEOState {
  seoTitle: string;
  metaDescription: string;
}

interface Props {
  status: BlogStatus;
  category: string;
  tags: string[];
  seoTitle: string;
  metaDescription: string;
  bodyText: string;
  titleKeyword: string;
  slug: string;
  hasImages: boolean;
  onStatusChange: (v: BlogStatus) => void;
  onCategoryChange: (v: string) => void;
  onTagsChange: (v: string[]) => void;
  onSeoChange: (v: SEOState) => void;
}

const CATEGORIES = [
  "Sustainability",
  "Wildlife",
  "Architecture",
  "Travel",
  "Wellness",
];

function SectionHeader({
  label,
  open,
  toggle,
}: {
  label: string;
  open: boolean;
  toggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="flex w-full items-center justify-between py-3 font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-muted)] hover:text-[var(--color-charcoal)] transition-colors"
    >
      {label}
      {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
    </button>
  );
}

export function PostSidebar({
  status,
  category,
  tags,
  seoTitle,
  metaDescription,
  bodyText,
  titleKeyword,
  slug,
  hasImages,
  onStatusChange,
  onCategoryChange,
  onTagsChange,
  onSeoChange,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [seoOpen, setSeoOpen] = useState(true);
  const [socialOpen, setSocialOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const seoTitleLen = seoTitle.length;
  const metaLen = metaDescription.length;

  const keyword = titleKeyword.toLowerCase().split(" ")[0] ?? "";
  const keywordInIntro = bodyText.slice(0, 100).toLowerCase().includes(keyword);
  const keywordInSlug = slug.toLowerCase().includes(keyword);
  const allImagesHaveAlt = !hasImages || bodyText.includes('alt="');

  function addTag(value: string) {
    const trimmed = value.trim().toLowerCase().replace(/\s+/g, "-");
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
    }
    setTagInput("");
  }

  return (
    <aside className="w-80 flex-shrink-0 border-l border-[var(--color-border)] bg-white px-6 py-6 space-y-0 overflow-y-auto">
      {/* Post Settings */}
      <div className="border-b border-[var(--color-border)]">
        <SectionHeader
          label="Post Settings"
          open={settingsOpen}
          toggle={() => setSettingsOpen((o) => !o)}
        />
        {settingsOpen && (
          <div className="pb-4 space-y-4">
            {/* Status */}
            <div>
              <p className="font-body text-xs text-[var(--color-muted)] mb-2">
                Publication Status
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    status === "published"
                      ? "bg-[var(--color-moss-green)]"
                      : "bg-[var(--color-gold-accent)]"
                  }`}
                />
                <select
                  value={status}
                  onChange={(e) => onStatusChange(e.target.value as BlogStatus)}
                  className="flex-1 font-body text-sm text-[var(--color-charcoal)] bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block font-body text-xs text-[var(--color-muted)] mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full font-body text-sm text-[var(--color-charcoal)] bg-[var(--color-cream)] border border-[var(--color-border)] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block font-body text-xs text-[var(--color-muted)] mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-[var(--color-cream)] text-[var(--color-earth-brown)] font-body text-xs px-2.5 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => onTagsChange(tags.filter((t) => t !== tag))}
                      className="hover:text-[var(--color-error)]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="Add tag…"
                  className="flex-1 font-body text-xs text-[var(--color-charcoal)] bg-[var(--color-cream)] border border-[var(--color-border)] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30"
                />
                <button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  className="p-1.5 bg-[var(--color-cream)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-earth-brown)] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[var(--color-earth-brown)]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO Health */}
      <div className="border-b border-[var(--color-border)]">
        <SectionHeader
          label="SEO Health"
          open={seoOpen}
          toggle={() => setSeoOpen((o) => !o)}
        />
        {seoOpen && (
          <div className="pb-4 space-y-4">
            {/* Score */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#EAE5DC"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#4A6741"
                    strokeWidth="3"
                    strokeDasharray="87 13"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-body text-xs font-semibold text-[var(--color-charcoal)]">
                  87
                </span>
              </div>
              <div>
                <p className="font-body text-sm font-medium text-[var(--color-charcoal)]">
                  Good
                </p>
                <p className="font-body text-xs text-[var(--color-muted)]">
                  Score / 100
                </p>
              </div>
            </div>

            {/* SEO Title */}
            <div>
              <label className="block font-body text-xs text-[var(--color-muted)] mb-1.5">
                SEO Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) =>
                  onSeoChange({ seoTitle: e.target.value, metaDescription })
                }
                maxLength={70}
                className="w-full font-body text-sm text-[var(--color-charcoal)] bg-[var(--color-cream)] border border-[var(--color-border)] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30"
              />
              <p
                className={`font-body text-xs mt-1 text-right ${
                  seoTitleLen > 60
                    ? "text-[var(--color-error)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                {seoTitleLen}/60
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block font-body text-xs text-[var(--color-muted)] mb-1.5">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) =>
                  onSeoChange({ seoTitle, metaDescription: e.target.value })
                }
                rows={3}
                maxLength={170}
                className="w-full font-body text-sm text-[var(--color-charcoal)] bg-[var(--color-cream)] border border-[var(--color-border)] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30 resize-none"
              />
              <p
                className={`font-body text-xs mt-1 text-right ${
                  metaLen > 155
                    ? "text-[var(--color-error)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                {metaLen}/155
              </p>
            </div>

            {/* Checklist */}
            <ul className="space-y-2">
              {[
                { label: "Keyword in intro", pass: keywordInIntro },
                { label: "Keyword in URL", pass: keywordInSlug },
                { label: "Alt text for images", pass: allImagesHaveAlt },
              ].map(({ label, pass }) => (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      pass
                        ? "border-[var(--color-moss-green)] bg-[var(--color-moss-green)]/10"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    {pass && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-moss-green)]" />
                    )}
                  </span>
                  <span className="font-body text-xs text-[var(--color-charcoal)]/80">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Social Preview */}
      <div>
        <SectionHeader
          label="Social Preview"
          open={socialOpen}
          toggle={() => setSocialOpen((o) => !o)}
        />
        {socialOpen && (
          <div className="pb-4">
            <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
              <div className="h-24 bg-[var(--color-warm-beige)] flex items-center justify-center">
                <span className="font-body text-xs text-[var(--color-muted)]">
                  Cover image
                </span>
              </div>
              <div className="p-3">
                <p className="font-body text-xs font-medium text-[var(--color-charcoal)] line-clamp-2">
                  {seoTitle || "Post title"}
                </p>
                <p className="font-body text-xs text-[var(--color-muted)] mt-1 line-clamp-2">
                  {metaDescription || "Post description"}
                </p>
                <p className="font-body text-xs text-[var(--color-muted)]/60 mt-1">
                  madhubanecoretreat.com
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
