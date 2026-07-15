import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Cookieless Supabase client for reading PUBLIC data in cacheable pages.
 *
 * Why this exists separately from `./server`:
 * `server.ts` builds a cookie-bound client, and reading cookies opts a route
 * out of static rendering. On a page that declares `export const revalidate`,
 * Next throws a DynamicServerError to signal the bailout — and if page code
 * catches it (e.g. a try/catch around the fetch), Next escalates it to a hard
 * 500. Public reads carry no user session, so the cookie jar buys nothing and
 * costs static rendering.
 *
 * Use this for anon-readable data behind RLS. Use `./server` when the request's
 * auth session matters, and `./admin` for service-role access.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new DataUnavailableError(
      "Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY)",
    );
  }

  return createSupabaseClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Thrown when the datastore cannot be reached or errors unexpectedly — as
 * opposed to answering correctly that a row does not exist. Callers use this to
 * tell "this room is gone" (404) apart from "we can't reach the database right
 * now" (retryable error page). The distinction matters for SEO: serving 404 for
 * a live URL during an outage invites de-indexing.
 */
export class DataUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "DataUnavailableError";
  }
}

/** PostgREST code for "no rows returned" from `.single()` — a real absence. */
export const PGRST_NO_ROWS = "PGRST116";
