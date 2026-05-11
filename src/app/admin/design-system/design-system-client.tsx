'use client';

import { useState } from 'react';
import {
  Bed, Tag, FileText, Calendar, LayoutDashboard, AlertTriangle,
  TrendingUp, Info,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Card, StatCard, Badge, Button, IconButton,
  Input, TextArea, Select, Toggle, DatePicker,
  Modal, Drawer, Tabs, EmptyState, Breadcrumb, DataTable,
} from '@/components/admin/ui';
import type { Column } from '@/components/admin/ui';

/* ── helpers ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-charcoal/40 border-b border-admin-card-border pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ── Sample data for DataTable ── */
type BookingRow = { ref: string; guest: string; room: string; status: string; total: string };

const TABLE_COLS: Column<Record<string, unknown>>[] = [
  { key: 'ref',    label: 'Ref',    sortable: true },
  { key: 'guest',  label: 'Guest',  sortable: true },
  { key: 'room',   label: 'Room' },
  { key: 'status', label: 'Status' },
  { key: 'total',  label: 'Total',  sortable: true },
];

const TABLE_DATA: BookingRow[] = [
  { ref: 'MBR-001', guest: 'Arjun Mehta',    room: 'Safari Tent',      status: 'Confirmed', total: '₹10,000' },
  { ref: 'MBR-002', guest: 'Priya Singh',    room: 'Mud House 1',      status: 'Pending',   total: '₹12,000' },
  { ref: 'MBR-003', guest: 'Rohit Sharma',   room: 'Pool Side Villa',  status: 'Checked In',total: '₹11,000' },
  { ref: 'MBR-004', guest: 'Meera Iyer',     room: 'Glamping Tent',    status: 'Cancelled', total: '₹9,000'  },
  { ref: 'MBR-005', guest: 'Kabir Bose',     room: 'Camping Tent',     status: 'Confirmed', total: '₹5,000'  },
];

const TABS_DEMO = [
  { label: 'Overview',  value: 'overview' },
  { label: 'Bookings',  value: 'bookings' },
  { label: 'Analytics', value: 'analytics' },
];

export function DesignSystemClient() {
  const [modalOpen, setModalOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab]               = useState('overview');
  const [toggleA, setToggleA]       = useState(true);
  const [toggleB, setToggleB]       = useState(false);
  const [textLen, setTextLen]       = useState(0);

  return (
    <div className="space-y-14 pb-20">
      <div>
        <p className="font-body text-xs uppercase tracking-widest text-charcoal/40 mb-1">
          Internal · Design System
        </p>
        <h1 className="font-display text-4xl text-charcoal">Component Library</h1>
        <p className="font-body text-sm text-charcoal/60 mt-1">
          Phase A1 — all variants, all states. Used as a regression baseline for A2-A8.
        </p>
      </div>

      {/* ── 1. Typography ── */}
      <Section title="Typography">
        <div className="space-y-3 bg-admin-card-bg rounded-xl border border-admin-card-border p-6">
          <p className="font-display text-5xl text-charcoal">Display / H1</p>
          <p className="font-display text-4xl text-charcoal">Display / H2</p>
          <p className="font-display text-3xl text-charcoal">Display / H3</p>
          <p className="font-display text-2xl text-charcoal">Display / H4</p>
          <hr className="border-admin-card-border" />
          <p className="font-body text-base text-charcoal">Body regular — Lato 16px</p>
          <p className="font-body text-sm text-charcoal/60">Body small / muted — 14px</p>
          <p className="font-body text-xs uppercase tracking-widest text-charcoal/40">Label / eyebrow — 12px</p>
          <p className="font-body text-xs text-charcoal/60">Caption — helper text, hints, secondary info</p>
        </div>
      </Section>

      {/* ── 2. Colors ── */}
      <Section title="Admin Design Tokens">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: 'sidebar-bg',         hex: '#1F2D1F', cls: 'bg-admin-sidebar-bg' },
            { name: 'sidebar-fg',         hex: '#E8E4DC', cls: 'bg-admin-sidebar-fg' },
            { name: 'sidebar-fg-muted',   hex: '#A8A099', cls: 'bg-admin-sidebar-fg-muted' },
            { name: 'canvas-bg',          hex: '#FAF7F2', cls: 'bg-admin-canvas-bg border' },
            { name: 'card-bg',            hex: '#FFFFFF',  cls: 'bg-admin-card-bg border' },
            { name: 'card-border',        hex: '#E8E1D8', cls: 'bg-admin-card-border' },
            { name: 'status-confirmed-bg',hex: '#DCEFDC', cls: 'bg-admin-status-confirmed-bg' },
            { name: 'status-confirmed-fg',hex: '#2D5A2D', cls: 'bg-admin-status-confirmed-fg' },
            { name: 'status-pending-bg',  hex: '#FFF3D6', cls: 'bg-admin-status-pending-bg' },
            { name: 'status-pending-fg',  hex: '#8B6914', cls: 'bg-admin-status-pending-fg' },
            { name: 'status-cancelled-bg',hex: '#F5DCDC', cls: 'bg-admin-status-cancelled-bg' },
            { name: 'status-cancelled-fg',hex: '#8B2D2D', cls: 'bg-admin-status-cancelled-fg' },
          ].map(({ name, hex, cls }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <div className={`h-10 rounded-lg ${cls}`} />
              <p className="font-body text-xs text-charcoal/60 leading-tight">{name}</p>
              <p className="font-body text-xs text-charcoal/40">{hex}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 3. Cards ── */}
      <Section title="Cards">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['default', 'padded', 'compact', 'ghost'] as const).map((v) => (
            <Card key={v} variant={v}>
              <p className="font-body text-xs uppercase tracking-wider text-charcoal/40 mb-1">
                Variant: {v}
              </p>
              <p className="font-body text-sm text-charcoal">Card content area with some sample text.</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── 4. Stat cards ── */}
      <Section title="Stat Cards">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Tonight's Check-ins" value="3" icon={<Calendar className="w-4 h-4" />} />
          <StatCard
            label="This Month Revenue"
            value="₹1.24L"
            delta={{ value: '+12% vs last month', direction: 'up' }}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            label="Occupancy"
            value="67%"
            delta={{ value: '−5% vs last week', direction: 'down' }}
          />
          <StatCard
            label="Pending Confirmations"
            value="2"
            delta={{ value: 'No change', direction: 'neutral' }}
            href="/admin/bookings"
          />
        </div>
      </Section>

      {/* ── 5. Badges ── */}
      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          <Badge variant="confirmed">Confirmed</Badge>
          <Badge variant="pending">Pending</Badge>
          <Badge variant="cancelled">Cancelled</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
      </Section>

      {/* ── 6. Buttons ── */}
      <Section title="Buttons">
        <div className="space-y-4">
          {(['primary', 'secondary', 'ghost', 'danger'] as const).map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              <span className="font-body text-xs text-charcoal/40 w-20 capitalize">{variant}</span>
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size.toUpperCase()}
                </Button>
              ))}
              <Button variant={variant} loading>Loading</Button>
              <Button variant={variant} disabled>Disabled</Button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 7. Icon Buttons ── */}
      <Section title="Icon Buttons">
        <div className="flex flex-wrap gap-3">
          <IconButton icon={<Bed className="w-4 h-4" />} label="Rooms" variant="ghost" />
          <IconButton icon={<Tag className="w-4 h-4" />} label="Tags" variant="default" />
          <IconButton icon={<FileText className="w-4 h-4" />} label="Posts" variant="ghost" />
          <IconButton icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" disabled />
        </div>
      </Section>

      {/* ── 8. Form fields ── */}
      <Section title="Form Fields">
        <div className="grid sm:grid-cols-2 gap-6">
          <Input label="Full Name" placeholder="Arjun Mehta" />
          <Input label="Email" type="email" placeholder="arjun@example.com" required helperText="Confirmation will be sent here" />
          <Input label="Phone" type="tel" placeholder="+91 9999999999" error="Please enter a valid phone number" />
          <Input label="Disabled" value="Read only" disabled />
          <TextArea
            label="Internal Notes"
            placeholder="Add notes about this booking..."
            maxLength={280}
            currentLength={textLen}
            helperText="Visible only to admin staff"
            onChange={(e) => setTextLen(e.target.value.length)}
          />
          <Select
            label="Booking Status"
            options={[
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'pending', label: 'Pending' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            placeholder="Select status..."
            helperText="Updates the booking state"
          />
          <Select
            label="Room Type (error)"
            options={[{ value: 'st', label: 'Safari Tent' }]}
            error="Please select a room"
          />
          <DatePicker label="Check-in Date" required helperText="Must be a future date" />
        </div>
        <div className="mt-6 space-y-4">
          <Toggle checked={toggleA} onChange={setToggleA} label="Active" description="Show this room on the public site" />
          <Toggle checked={toggleB} onChange={setToggleB} label="Featured" description="Display in the featured rooms section" />
          <Toggle checked={false} onChange={() => {}} label="Disabled toggle" disabled />
        </div>
      </Section>

      {/* ── 9. Modal ── */}
      <Section title="Modal">
        <div className="flex gap-3">
          <Button onClick={() => setModalOpen(true)}>Open Modal (md)</Button>
        </div>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Cancellation" size="md">
          <p className="font-body text-sm text-charcoal/70 mb-6">
            Are you sure you want to cancel booking MBR-20260501-0003? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Keep Booking</Button>
            <Button variant="danger" onClick={() => setModalOpen(false)}>Cancel Booking</Button>
          </div>
        </Modal>
      </Section>

      {/* ── 10. Drawer ── */}
      <Section title="Drawer">
        <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Edit Booking" size="md">
          <div className="space-y-4">
            <Input label="Guest Name" placeholder="Arjun Mehta" />
            <Input label="Email" type="email" placeholder="arjun@example.com" />
            <DatePicker label="Check-in" />
            <DatePicker label="Check-out" />
            <Select label="Status" options={[
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'pending', label: 'Pending' },
            ]} />
            <div className="pt-4 flex gap-3 justify-end border-t border-admin-card-border">
              <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button onClick={() => setDrawerOpen(false)}>Save Changes</Button>
            </div>
          </div>
        </Drawer>
      </Section>

      {/* ── 11. Tabs ── */}
      <Section title="Tabs">
        <Card variant="compact">
          <Tabs tabs={TABS_DEMO} value={tab} onChange={setTab} />
          <div className="pt-4 font-body text-sm text-charcoal/60">
            Active tab: <strong className="text-charcoal">{tab}</strong>
          </div>
        </Card>
      </Section>

      {/* ── 12. Empty States ── */}
      <Section title="Empty States">
        <div className="grid sm:grid-cols-3 gap-4">
          <Card variant="compact">
            <EmptyState
              icon={<Calendar className="w-6 h-6" />}
              title="No bookings yet"
              description="Bookings will appear here once guests start reserving rooms."
            />
          </Card>
          <Card variant="compact">
            <EmptyState
              icon={<FileText className="w-6 h-6" />}
              title="No blog posts"
              description="Start sharing stories from the forest."
              action={{ label: 'Write first post', href: '/admin/posts/new' }}
            />
          </Card>
          <Card variant="compact">
            <EmptyState
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Search returned nothing"
              description="Try adjusting your filters or search term."
            />
          </Card>
        </div>
      </Section>

      {/* ── 13. Breadcrumb ── */}
      <Section title="Breadcrumb">
        <Card variant="compact">
          <p className="font-body text-xs text-charcoal/40 mb-2">Auto-derived from current URL path:</p>
          <Breadcrumb />
          <p className="font-body text-xs text-charcoal/40 mt-4 mb-2">Manual items prop:</p>
          <Breadcrumb items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Bookings', href: '/admin/bookings' },
            { label: 'MBR-20260501-0001', href: '/admin/bookings/123' },
          ]} />
        </Card>
      </Section>

      {/* ── 14. Data Table ── */}
      <Section title="Data Table">
        <DataTable
          columns={TABLE_COLS}
          data={TABLE_DATA as unknown as Record<string, unknown>[]}
          selectable
          emptyIcon={<Calendar className="w-6 h-6" />}
          emptyTitle="No bookings"
          emptyDescription="Bookings will appear here."
        />
      </Section>

      {/* ── 15. Toast triggers ── */}
      <Section title="Toast Notifications">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => toast.success('Booking confirmed successfully')}>
            Success toast
          </Button>
          <Button variant="danger" onClick={() => toast.error('Failed to update room. Try again.')}>
            Error toast
          </Button>
          <Button variant="secondary" onClick={() => toast.info('Reminder sent to guest')}>
            Info toast
          </Button>
          <Button variant="ghost" onClick={() => {
            const id = toast.loading('Saving changes…');
            setTimeout(() => toast.success('Saved!', { id }), 2000);
          }}>
            Loading → success
          </Button>
        </div>
      </Section>

      {/* ── 16. Admin accent (gold) usage ── */}
      <Section title="Admin Accent (gold-accent reuse)">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gold-accent" />
            <span className="font-body text-sm text-charcoal">Icon in gold-accent</span>
          </div>
          <div className="h-1 w-24 rounded-full bg-gold-accent opacity-60" />
          <Badge variant="neutral">Uses admin-status-neutral</Badge>
          <span className="font-body text-sm font-medium text-gold-accent">Active link color</span>
        </div>
      </Section>
    </div>
  );
}
