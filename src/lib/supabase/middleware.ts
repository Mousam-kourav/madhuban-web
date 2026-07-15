import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

// Hard cap on how long the auth refresh may block the edge middleware.
// If Supabase is slow/unreachable, we must NOT hang the request — a hung
// middleware surfaces on Vercel as 504 MIDDLEWARE_INVOCATION_TIMEOUT.
const AUTH_TIMEOUT_MS = 3000;

export async function updateSession(
  request: NextRequest,
  response: NextResponse,
) {
  // Guard: if Supabase env vars are missing (e.g. not set in Vercel), skip
  // auth entirely instead of constructing a client with undefined URL/key,
  // which would hang the fetch to `getUser()` until the invocation times out.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      "[middleware] Supabase env vars missing — skipping session refresh",
    );
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session, but never let it block longer than AUTH_TIMEOUT_MS.
  // Racing against a timeout guarantees the middleware returns even if the
  // Supabase Auth endpoint hangs. Any error (network, timeout, bad config)
  // fails silently so the request is served instead of erroring out.
  try {
    await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("supabase.auth.getUser timed out")),
          AUTH_TIMEOUT_MS,
        ),
      ),
    ]);
  } catch (error) {
    console.warn("[middleware] session refresh skipped:", error);
  }

  return response;
}
