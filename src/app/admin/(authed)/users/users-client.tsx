"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus, ShieldCheck, Eye, Pencil, Trash2 } from "lucide-react";
import { Card, Button, Input, Select, Modal, Badge } from "@/components/admin/ui";
import type { AdminRole } from "@/lib/admin/auth";

interface StaffUser {
  user_id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
}

const ROLE_LABELS: Record<AdminRole, string> = {
  admin: "Admin",
  front_desk: "Front Desk",
  read_only: "Read Only",
};

const ROLE_BADGE: Record<AdminRole, "confirmed" | "info" | "neutral"> = {
  admin: "confirmed",
  front_desk: "info",
  read_only: "neutral",
};

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Front Desk", value: "front_desk" },
  { label: "Read Only", value: "read_only" },
];

export function UsersClient() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [form, setForm] = useState({ email: "", full_name: "", role: "front_desk" as AdminRole });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json() as { users: StaffUser[] };
      setUsers(json.users ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  async function handleAdd() {
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const json = await res.json() as { error: string };
        setAddError(json.error ?? "Failed to add user");
        return;
      }
      setAddOpen(false);
      setForm({ email: "", full_name: "", role: "front_desk" });
      void fetchUsers();
    } finally {
      setAdding(false);
    }
  }

  async function handleDeactivate(userId: string) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
    void fetchUsers();
  }

  async function handleRoleChange(userId: string, role: AdminRole) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    void fetchUsers();
  }

  const activeUsers = users.filter((u) => u.is_active);
  const inactiveUsers = users.filter((u) => !u.is_active);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-charcoal">Staff</h1>
          <p className="mt-1 font-body text-sm text-charcoal/60">
            {activeUsers.length} active staff member{activeUsers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <UserPlus className="h-4 w-4" /> Add Staff
        </Button>
      </div>

      {/* Active users */}
      <Card variant="compact">
        {loading && (
          <div className="space-y-2 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-warm-beige/30" />
            ))}
          </div>
        )}
        {!loading && activeUsers.length === 0 && (
          <p className="py-8 text-center font-body text-sm text-charcoal/40">No staff yet.</p>
        )}
        {!loading && activeUsers.length > 0 && (
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-admin-card-border">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal/50 pr-4">Name / Email</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal/50 pr-4">Role</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((u) => (
                <tr key={u.user_id} className="border-b border-admin-card-border/50">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-charcoal">{u.full_name ?? "—"}</p>
                    <p className="text-xs text-charcoal/50">{u.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={ROLE_BADGE[u.role]}>
                      {u.role === "admin" && <ShieldCheck className="mr-1 h-3 w-3" />}
                      {u.role === "front_desk" && <Pencil className="mr-1 h-3 w-3" />}
                      {u.role === "read_only" && <Eye className="mr-1 h-3 w-3" />}
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded-md border border-admin-card-border bg-transparent px-2 py-1 font-body text-xs text-charcoal focus:outline-none"
                        value={u.role}
                        onChange={(e) => void handleRoleChange(u.user_id, e.target.value as AdminRole)}
                      >
                        {ROLE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => void handleDeactivate(u.user_id)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-body text-xs text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Inactive users (collapsed) */}
      {!loading && inactiveUsers.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer font-body text-sm text-charcoal/50 hover:text-charcoal">
            {inactiveUsers.length} deactivated staff member{inactiveUsers.length !== 1 ? "s" : ""}
          </summary>
          <Card variant="compact" className="mt-3 opacity-60">
            <table className="w-full font-body text-sm">
              <tbody>
                {inactiveUsers.map((u) => (
                  <tr key={u.user_id} className="border-b border-admin-card-border/50">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-charcoal line-through">{u.full_name ?? "—"}</p>
                      <p className="text-xs text-charcoal/50">{u.email}</p>
                    </td>
                    <td className="py-3">
                      <Badge variant="neutral">{ROLE_LABELS[u.role]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </details>
      )}

      {/* Add Staff modal */}
      <Modal
        open={addOpen}
        onClose={() => { setAddOpen(false); setAddError(""); }}
        title="Add Staff Member"
      >
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="staff@example.com"
          />
          <Input
            label="Full Name"
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            placeholder="Jane Doe"
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as AdminRole }))}
            options={ROLE_OPTIONS}
          />
          {addError && (
            <p className="font-body text-xs text-red-500">{addError}</p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button loading={adding} onClick={() => void handleAdd()}>
              <UserPlus className="h-4 w-4" /> Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
