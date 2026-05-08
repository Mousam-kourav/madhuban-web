"use client";

import { useState, useCallback, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import {
  Card,
  Badge,
  Button,
  Input,
  Select,
  DataTable,
  Drawer,
} from "@/components/admin/ui";
import type { Column } from "@/components/admin/ui";
import type { LeadRow, LeadStatus } from "@/lib/supabase/database.types";

const PAGE_SIZE = 25;

const SOURCE_LABELS: Record<string, string> = {
  contact_form: "Contact",
  souvenirs_inquiry: "Souvenirs",
  experiences_inquiry: "Experiences",
  other: "Other",
};

const STATUS_BADGE: Record<LeadStatus, { variant: "pending" | "confirmed" | "neutral"; label: string }> = {
  new:       { variant: "pending",   label: "New" },
  contacted: { variant: "confirmed", label: "Contacted" },
  closed:    { variant: "neutral",   label: "Closed" },
};

const SOURCE_BADGE_VARIANT: Record<string, "info" | "pending" | "confirmed" | "neutral"> = {
  contact_form:         "info",
  souvenirs_inquiry:    "pending",
  experiences_inquiry:  "confirmed",
  other:                "neutral",
};

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const SOURCE_OPTIONS = [
  { value: "", label: "All Sources" },
  { value: "contact_form", label: "Contact Form" },
  { value: "souvenirs_inquiry", label: "Souvenirs" },
  { value: "experiences_inquiry", label: "Experiences" },
  { value: "other", label: "Other" },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

interface LeadsResponse {
  leads: LeadRow[];
  total: number;
  page: number;
  pageSize: number;
}

const COLUMNS: Column<LeadRow>[] = [
  {
    key: "created_at",
    label: "Created",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-charcoal/60 whitespace-nowrap">{fmtDate(row.created_at)}</span>
    ),
  },
  {
    key: "name",
    label: "Name",
    render: (row) => <span className="font-medium text-charcoal">{row.name}</span>,
  },
  {
    key: "email",
    label: "Email",
    render: (row) => <span className="text-sm text-charcoal/80">{row.email}</span>,
  },
  {
    key: "phone",
    label: "Phone",
    render: (row) => (
      <span className="text-sm text-charcoal/60">{row.phone ?? "—"}</span>
    ),
  },
  {
    key: "source",
    label: "Source",
    render: (row) => (
      <Badge variant={SOURCE_BADGE_VARIANT[row.source] ?? "neutral"}>
        {SOURCE_LABELS[row.source] ?? row.source}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const s = STATUS_BADGE[row.status] ?? { variant: "neutral" as const, label: row.status };
      return <Badge variant={s.variant}>{s.label}</Badge>;
    },
  },
];

export function LeadsClient({ isAdmin }: { isAdmin: boolean }) {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);

  const fetchLeads = useCallback(async (pg: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pg), pageSize: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (source) params.set("source", source);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    try {
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = (await res.json()) as LeadsResponse;
      setLeads(data.leads ?? []);
      setTotal(data.total ?? 0);
      setPage(pg);
    } finally {
      setLoading(false);
    }
  }, [search, status, source, dateFrom, dateTo]);

  useEffect(() => { void fetchLeads(1); }, [fetchLeads]);

  async function updateStatus(id: string, newStatus: LeadStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
      setSelectedLead((prev) => prev?.id === id ? { ...prev, status: newStatus } : prev);
    } catch (err) {
      console.error("[leads] status update failed:", err);
    } finally {
      setUpdating(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-charcoal">Leads</h1>
        <p className="mt-1 font-body text-sm text-charcoal/60">
          {total.toLocaleString("en-IN")} total leads
        </p>
      </div>

      {/* Filters */}
      <Card variant="compact">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            label="Search"
            placeholder="name, email, message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Select
            label="Source"
            options={SOURCE_OPTIONS}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <Input label="From" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <Card variant="compact">
          <div className="space-y-2 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-warm-beige/30" />
            ))}
          </div>
        </Card>
      ) : (
        <DataTable<LeadRow>
          columns={COLUMNS}
          data={leads}
          onRowClick={(row) => setSelectedLead(row)}
          emptyIcon={<MessageSquare className="h-8 w-8 text-charcoal/20" />}
          emptyTitle="No leads yet"
          emptyDescription="Leads from the contact form will appear here."
          pagination={
            totalPages > 1
              ? { page, pageSize: PAGE_SIZE, total, onPageChange: (p) => void fetchLeads(p) }
              : undefined
          }
        />
      )}

      {/* Detail drawer */}
      <Drawer
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead?.name ?? "Lead"}
        size="md"
      >
        {selectedLead && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Email</p>
                <p className="mt-1 font-body text-sm text-charcoal break-all">{selectedLead.email}</p>
              </div>
              {selectedLead.phone && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Phone</p>
                  <p className="mt-1 font-body text-sm text-charcoal">{selectedLead.phone}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-1">Source</p>
                <Badge variant={SOURCE_BADGE_VARIANT[selectedLead.source] ?? "neutral"}>
                  {SOURCE_LABELS[selectedLead.source] ?? selectedLead.source}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-1">Status</p>
                {(() => {
                  const s = STATUS_BADGE[selectedLead.status] ?? { variant: "neutral" as const, label: selectedLead.status };
                  return <Badge variant={s.variant}>{s.label}</Badge>;
                })()}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Received</p>
              <p className="mt-1 font-body text-sm text-charcoal/60">{fmtDate(selectedLead.created_at)}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">Message</p>
              <p className="rounded-xl bg-admin-canvas-bg p-4 font-body text-sm text-charcoal whitespace-pre-wrap leading-relaxed">
                {selectedLead.message}
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={selectedLead.status === "contacted" || updating}
                  onClick={() => void updateStatus(selectedLead.id, "contacted")}
                >
                  Mark Contacted
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={selectedLead.status === "closed" || updating}
                  onClick={() => void updateStatus(selectedLead.id, "closed")}
                >
                  Mark Closed
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
