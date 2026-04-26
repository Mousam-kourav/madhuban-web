"use client";

import type { Editor } from "@tiptap/react";
import {
  Heading1,
  Heading2,
  Bold,
  Italic,
  Link2,
  Quote,
  Image as ImageIcon,
  MoreHorizontal,
} from "lucide-react";

interface Props {
  editor: Editor | null;
  onImageUpload: () => void;
}

export function PostToolbar({ editor, onImageUpload }: Props) {
  if (!editor) return null;

  function setLink() {
    const url = window.prompt("URL");
    if (!url) return;
    editor!.chain().focus().setLink({ href: url }).run();
  }

  const tools = [
    {
      icon: Heading1,
      label: "Heading 1",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: Bold,
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    {
      icon: Link2,
      label: "Link",
      action: setLink,
      active: editor.isActive("link"),
    },
    {
      icon: Quote,
      label: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
    },
    {
      icon: ImageIcon,
      label: "Image",
      action: onImageUpload,
      active: false,
    },
    {
      icon: MoreHorizontal,
      label: "More",
      action: () => {},
      active: false,
    },
  ];

  return (
    <div className="sticky top-[57px] z-10 flex items-center gap-1 bg-[var(--color-forest-green)] rounded-full px-3 py-2 w-fit mx-auto shadow-md">
      {tools.map(({ icon: Icon, label, action, active }) => (
        <button
          key={label}
          type="button"
          title={label}
          onClick={action}
          className={`p-2 rounded-full transition-colors ${
            active
              ? "bg-white/20 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
          aria-label={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
