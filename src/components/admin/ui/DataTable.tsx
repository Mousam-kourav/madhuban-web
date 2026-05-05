'use client';

import { useState, type ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from './EmptyState';
import { IconButton } from './IconButton';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: PaginationConfig;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

type SortDir = 'asc' | 'desc';

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  selectable,
  onRowClick,
  pagination,
  emptyIcon,
  emptyTitle = 'No records found',
  emptyDescription = 'There is nothing here yet.',
  className,
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const allSelected = data.length > 0 && selected.size === data.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(data.map((_, i) => i)));
  }

  function toggleRow(i: number) {
    const next = new Set(selected);
    if (next.has(i)) { next.delete(i); } else { next.add(i); }
    setSelected(next);
  }

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon ?? <span className="text-2xl">📋</span>}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

  return (
    <div className={cn('flex flex-col gap-0', className)}>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg shadow-[var(--admin-card-shadow)]">
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-admin-card-border bg-admin-canvas-bg">
                {selectable && (
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all"
                      className="rounded border-admin-card-border"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left">
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1 font-semibold text-xs uppercase tracking-wider text-charcoal/60 hover:text-charcoal transition-colors"
                      >
                        {col.label}
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )
                        ) : (
                          <ChevronDown className="w-3 h-3 opacity-30" />
                        )}
                      </button>
                    ) : (
                      <span className="font-semibold text-xs uppercase tracking-wider text-charcoal/60">
                        {col.label}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-card-border">
              {sorted.map((row, i) => (
                <tr
                  key={i}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-admin-canvas-bg'
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(i)}
                        onChange={() => toggleRow(i)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select row ${i + 1}`}
                        className="rounded border-admin-card-border"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-charcoal">
                      {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {sorted.map((row, i) => (
          <div
            key={i}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(
              'rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-[var(--admin-card-shadow)]',
              onRowClick && 'cursor-pointer'
            )}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between py-1 text-sm">
                <span className="font-semibold text-xs uppercase tracking-wider text-charcoal/50 mr-4 flex-shrink-0">
                  {col.label}
                </span>
                <span className="text-charcoal text-right">
                  {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 font-body text-sm text-charcoal/60">
          <span>
            {((pagination.page - 1) * pagination.pageSize) + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
          </span>
          <div className="flex items-center gap-1">
            <IconButton
              icon={<ChevronLeft className="w-4 h-4" />}
              label="Previous page"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            />
            <span className="px-2 tabular-nums">
              {pagination.page} / {totalPages}
            </span>
            <IconButton
              icon={<ChevronRight className="w-4 h-4" />}
              label="Next page"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
