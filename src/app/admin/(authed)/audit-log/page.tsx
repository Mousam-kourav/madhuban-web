import type { Metadata } from "next";
import { AuditLogClient } from "./audit-log-client";

export const metadata: Metadata = { title: "Audit Log — Madhuban Admin" };

export default function AuditLogPage() {
  return <AuditLogClient />;
}
