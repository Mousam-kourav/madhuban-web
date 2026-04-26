"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Bed,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  TreePine,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FileText, label: "Blog Posts", href: "/admin/posts" },
];

const DISABLED_ITEMS = [
  { icon: Bed, label: "Rooms", note: "Coming in 5B" },
  { icon: Calendar, label: "Reservations", note: "Coming in Phase 7" },
];

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const sidebar = (
    <aside className="w-64 min-h-screen bg-[var(--color-forest-green)] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 rounded-xl p-2">
            <TreePine className="w-5 h-5 text-[var(--color-ivory)]" />
          </div>
          <div>
            <p className="text-[var(--color-ivory)] font-body font-semibold text-sm tracking-wide">
              Madhuban
            </p>
            <p className="text-[var(--color-ivory)]/50 font-body text-xs tracking-widest uppercase">
              Estate Management
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-colors ${
                active
                  ? "bg-white/15 text-[var(--color-ivory)]"
                  : "text-[var(--color-ivory)]/70 hover:bg-white/10 hover:text-[var(--color-ivory)]"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}

        {DISABLED_ITEMS.map(({ icon: Icon, label, note }) => (
          <div
            key={label}
            title={note}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-[var(--color-ivory)]/30 cursor-not-allowed"
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full">
              Soon
            </span>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-6 border-t border-white/10 space-y-1">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-[var(--color-ivory)]/70 hover:bg-white/10 hover:text-[var(--color-ivory)] transition-colors cursor-not-allowed opacity-50">
          <Settings className="w-4 h-4 flex-shrink-0" />
          Settings
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-[var(--color-ivory)]/70 hover:bg-white/10 hover:text-[var(--color-ivory)] transition-colors cursor-not-allowed opacity-50">
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          Support
        </button>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-[var(--color-ivory)]/70 hover:bg-white/10 hover:text-[var(--color-ivory)] transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">{sidebar}</div>

      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-[var(--color-forest-green)] text-[var(--color-ivory)] rounded-xl"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 flex">
              {sidebar}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1 text-[var(--color-ivory)]/70 hover:text-[var(--color-ivory)]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
