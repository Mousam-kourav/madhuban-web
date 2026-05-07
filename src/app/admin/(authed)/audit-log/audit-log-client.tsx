"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { Card, Input, Button } from "@/components/admin/ui";
import type { AuditLogRow } from "@/lib/supabase/database.types";

interface AuditEntry extends AuditLogRow {
  actor_email: string | null;
}

interface AuditResponse {
  entries: AuditEntry[];
  total: number;
  page: number;
  pageSize: number;
}

const PAGE_SIZE = 25;

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function actorLabel(entry: AuditEntry): string {
  if (entry.actor_email) return entry.actor_email;
  if (entry.admin_user_id === "system") return "system";
  return `User: ${entry.admin_user_id.slice(0, 8)}`;
}

function ExpandedDetails({ details }: { details: unknown }) {
  return (
    <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-charcoal/5 p-3 font-mono text-[11px] text-charcoal/80">
      {JSON.stringify(details, null, 2)}
    </pre>
  );
}

export function AuditLogClient() {
  const router = useRouter();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEntries = useCallback(async (pg: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pg), pageSize: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (actionFilter) params.set("action", actionFilter);

    try {
      const res = await fetch(`/api/admin/audit-log?${params.toString()}`);
      const data = (await res.json()) as AuditResponse;
      setEntries(data.entries ?? []);
      setTotal(data.total ?? 0);
      setPage(pg);
    } finally {
      setLoading(false);
    }
  }, [search, dateFrom, dateTo, actionFilter]);

  useEffect(() => { void fetchEntries(1); }, [fetchEntries]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-charcoal">Audit Log</h1>
        <p className="mt-1 font-body text-sm text-charcoal/60">
          {total.toLocaleString("en-IN")} total entries · read-only
        </p>
      </div>

      {/* Filters */}
      <Card variant="compact">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <Input
            label="Search"
            placeholder="action, entity ID, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input label="From" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <Input
            label="Action type"
            placeholder="e.g. check_in"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          />
        </div>
      </Card>

      {/* Table */}
      <Card variant="compact">
        {loading && (
          <div className="space-y-2 py-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-warm-beige/30" />
            ))}
          </div>
        )}

        {!loading && entries.length === 0 && (
          <p className="py-8 text-center font-body text-sm text-charcoal/40">No entries found.</p>
        )}

        {!loading && entries.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-admin-card-border">
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal/50 pr-4">Time</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal/50 pr-4">Actor</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal/50 pr-4">Action</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal/50 pr-4">Entity</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal/50">Details</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <>
                    <tr
                      key={entry.id}
                      className="border-b border-admin-card-border/50 hover:bg-warm-beige/10 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <td className="py-3 pr-4 text-xs text-charcoal/60 whitespace-nowrap">
                        {fmtTime(entry.created_at)}
                      </td>
                      <td className="py-3 pr-4 text-xs text-charcoal">
                        {actorLabel(entry)}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="rounded-md bg-charcoal/5 px-2 py-0.5 font-mono text-xs text-charcoal">
                          {entry.action}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {entry.entity_type === "booking" ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/bookings/${entry.entity_id}`);
                            }}
                            className="flex items-center gap-1 text-xs text-earth-brown hover:underline"
                          >
                            {entry.entity_type}
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-xs text-charcoal/60">{entry.entity_type}</span>
                        )}
                      </td>
                      <td className="py-3">
                        {entry.details ? (
                          <span className="text-charcoal/40">
                            {expandedId === entry.id ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          </span>
                        ) : (
                          <span className="text-xs text-charcoal/30">—</span>
                        )}
                      </td>
                    </tr>
                    {expandedId === entry.id && entry.details && (
                      <tr key={`${entry.id}-detail`} className="bg-warm-beige/10">
                        <td colSpan={5} className="px-4 pb-3">
                          <ExpandedDetails details={entry.details} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between font-body text-sm">
          <p className="text-charcoal/60">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => void fetchEntries(page - 1)}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => void fetchEntries(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
