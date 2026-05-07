'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Bed,
  Calendar,
  Tag,
  ShoppingBag,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const R2 = process.env.NEXT_PUBLIC_R2_BASE ?? '';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/admin' },
  { icon: Calendar,        label: 'Bookings',      href: '/admin/bookings' },
  { icon: Receipt,         label: 'Invoices',      href: '/admin/invoices' },
  { icon: Bed,             label: 'Rooms',         href: '/admin/rooms' },
  { icon: FileText,        label: 'Blog Posts',    href: '/admin/posts' },
  { icon: Tag,             label: 'Coupons',       href: '/admin/coupons' },
  { icon: ShoppingBag,     label: 'Souvenir Shop', href: '/admin/souvenirs' },
];

function NavLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm transition-colors',
        active
          ? 'bg-admin-sidebar-active-bg text-admin-sidebar-active-fg'
          : 'text-admin-sidebar-fg-muted hover:bg-admin-sidebar-active-bg/60 hover:text-admin-sidebar-fg'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      {label}
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-admin-sidebar-bg">
      {/* Logo + wordmark */}
      <div
        className="px-5 py-6 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--admin-sidebar-border)' }}
      >
        <div className="flex items-center gap-3">
          <Image
            src={`${R2}/branding/logo/madhuban-mark-md.webp`}
            alt="Madhuban Eco Retreat"
            width={40}
            height={40}
            className="rounded-lg flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-display text-admin-sidebar-fg text-lg leading-tight">
              Madhuban
            </p>
            <p className="font-body text-admin-sidebar-fg-muted text-[10px] uppercase tracking-[0.18em] leading-tight mt-0.5">
              Eco Retreat Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ icon, label, href }) => (
          <NavLink key={href} href={href} icon={icon} label={label} onClick={onClose} />
        ))}
      </nav>

      {/* Footer actions */}
      <div
        className="px-3 py-4 flex-shrink-0 space-y-0.5"
        style={{ borderTop: '1px solid var(--admin-sidebar-border)' }}
      >
        <button
          type="button"
          disabled
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm text-admin-sidebar-fg-muted opacity-40 cursor-not-allowed"
        >
          <Settings className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Settings
        </button>
        <button
          type="button"
          disabled
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm text-admin-sidebar-fg-muted opacity-40 cursor-not-allowed"
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Support
        </button>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm text-admin-sidebar-fg-muted hover:bg-admin-sidebar-active-bg/60 hover:text-admin-sidebar-fg transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop — fixed sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile — hamburger button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden fixed top-4 left-4 z-40 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-admin-sidebar-bg text-admin-sidebar-fg shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile — overlay + drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 flex shadow-xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 p-1 text-admin-sidebar-fg-muted hover:text-admin-sidebar-fg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </>
  );
}
