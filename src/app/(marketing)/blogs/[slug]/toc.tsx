"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({
  headings,
  readTime,
}: {
  headings: Heading[];
  readTime: number | null;
}) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0]!.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24 space-y-4">
      <p className="font-body text-xs font-semibold tracking-widest uppercase text-[var(--color-muted)]">
        In This Article
      </p>
      <nav>
        <ul className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <li key={id} style={{ paddingLeft: level === 3 ? "12px" : "0" }}>
              <a
                href={`#${id}`}
                className={`block font-body text-sm leading-snug transition-colors ${
                  active === id
                    ? "text-[var(--color-earth-brown)] font-medium"
                    : "text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)]"
                }`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {readTime && (
        <p className="font-body text-xs text-[var(--color-muted)] pt-2 border-t border-[var(--color-border)]">
          {readTime} min read
        </p>
      )}
    </div>
  );
}
