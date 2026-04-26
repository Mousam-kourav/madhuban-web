import React from "react";
import Image from "next/image";
import type { TiptapNode, TiptapMark } from "./types";

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function getTextContent(node: TiptapNode): string {
  if (node.text) return node.text;
  return (node.content ?? []).map(getTextContent).join("");
}

function applyMarks(text: string, marks: TiptapMark[]): React.ReactNode {
  return marks.reduce<React.ReactNode>((node, mark) => {
    switch (mark.type) {
      case "bold":
        return <strong>{node}</strong>;
      case "italic":
        return <em>{node}</em>;
      case "code":
        return (
          <code className="bg-warm-beige/60 rounded px-1 py-0.5 text-sm font-mono">
            {node}
          </code>
        );
      case "link": {
        const href = mark.attrs?.href as string | undefined;
        const isExternal = href?.startsWith("http");
        return (
          <a
            href={href}
            className="underline text-[var(--color-earth-brown)] hover:text-[var(--color-blush-dusk)] transition-colors"
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {node}
          </a>
        );
      }
      default:
        return node;
    }
  }, text);
}

function renderNode(node: TiptapNode, index: number): React.ReactNode {
  const key = index;

  switch (node.type) {
    case "doc":
      return (
        <React.Fragment key={key}>
          {(node.content ?? []).map((child, i) => renderNode(child, i))}
        </React.Fragment>
      );

    case "paragraph": {
      const children = (node.content ?? []).map((child, i) =>
        renderNode(child, i),
      );
      return (
        <p key={key} className="mb-6 leading-relaxed">
          {children}
        </p>
      );
    }

    case "heading": {
      const level = (node.attrs?.level as number) ?? 2;
      const text = getTextContent(node);
      const id = slugifyHeading(text);
      const children = (node.content ?? []).map((child, i) =>
        renderNode(child, i),
      );

      if (level === 1) {
        return (
          <h1
            key={key}
            id={id}
            className="font-display italic text-4xl mt-14 mb-4 text-[var(--color-charcoal)]"
          >
            {children}
          </h1>
        );
      }
      if (level === 2) {
        return (
          <h2
            key={key}
            id={id}
            className="font-display italic text-3xl mt-12 mb-4 text-[var(--color-charcoal)]"
          >
            {children}
          </h2>
        );
      }
      return (
        <h3
          key={key}
          id={id}
          className="font-display italic text-2xl mt-8 mb-2 text-[var(--color-charcoal)]"
        >
          {children}
        </h3>
      );
    }

    case "text": {
      const text = node.text ?? "";
      if (!node.marks || node.marks.length === 0) return text;
      return (
        <React.Fragment key={key}>
          {applyMarks(text, node.marks)}
        </React.Fragment>
      );
    }

    case "bulletList":
      return (
        <ul key={key} className="list-disc pl-6 mb-6 space-y-2">
          {(node.content ?? []).map((child, i) => renderNode(child, i))}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={key} className="list-decimal pl-6 mb-6 space-y-2">
          {(node.content ?? []).map((child, i) => renderNode(child, i))}
        </ol>
      );

    case "listItem":
      return (
        <li key={key} className="leading-relaxed">
          {(node.content ?? []).map((child, i) => renderNode(child, i))}
        </li>
      );

    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-2 border-[var(--color-earth-brown)] pl-6 italic my-8 text-[var(--color-charcoal)]/80"
        >
          {(node.content ?? []).map((child, i) => renderNode(child, i))}
        </blockquote>
      );

    case "hardBreak":
      return <br key={key} />;

    case "horizontalRule":
      return (
        <hr
          key={key}
          className="my-8 border-t border-[var(--color-border)]"
        />
      );

    case "image": {
      const src = node.attrs?.src as string | undefined;
      const alt = (node.attrs?.alt as string | undefined) ?? "";
      if (!src) return null;
      return (
        <div key={key} className="my-8">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={675}
            className="rounded-2xl w-full h-auto"
          />
        </div>
      );
    }

    case "codeBlock":
      return (
        <pre
          key={key}
          className="bg-[var(--color-charcoal)] text-[var(--color-cream)] rounded-xl p-6 overflow-x-auto my-8 text-sm"
        >
          <code>
            {(node.content ?? []).map((child, i) => renderNode(child, i))}
          </code>
        </pre>
      );

    case "code":
      return (
        <code
          key={key}
          className="bg-warm-beige/60 rounded px-1 py-0.5 text-sm font-mono"
        >
          {(node.content ?? []).map((child, i) => renderNode(child, i))}
        </code>
      );

    default:
      if (node.content) {
        return (
          <React.Fragment key={key}>
            {node.content.map((child, i) => renderNode(child, i))}
          </React.Fragment>
        );
      }
      return node.text ?? null;
  }
}

export function renderTiptap(json: unknown): React.ReactNode {
  if (!json || typeof json !== "object") return null;
  const node = json as TiptapNode;
  return renderNode(node, 0);
}

export function extractHeadings(
  json: unknown,
): { id: string; text: string; level: number }[] {
  if (!json || typeof json !== "object") return [];
  const node = json as TiptapNode;
  const headings: { id: string; text: string; level: number }[] = [];

  function walk(n: TiptapNode) {
    if (n.type === "heading") {
      const text = getTextContent(n);
      headings.push({
        id: slugifyHeading(text),
        text,
        level: (n.attrs?.level as number) ?? 2,
      });
    }
    (n.content ?? []).forEach(walk);
  }

  walk(node);
  return headings;
}
