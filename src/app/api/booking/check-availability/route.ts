import { NextRequest, NextResponse } from "next/server";
import { checkAvailabilitySchema } from "@/lib/booking/schemas";
import { checkAvailability } from "@/lib/booking/availability";
import { checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const rl = await checkRateLimit(req);
  if (rl.limited) {
    return NextResponse.json(
      { error: "rate_limited", retry_after: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkAvailabilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  try {
    const result = await checkAvailability(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[check-availability]", err);
    return NextResponse.json(
      { error: "Unable to check availability. Please try again." },
      { status: 500 },
    );
  }
}
