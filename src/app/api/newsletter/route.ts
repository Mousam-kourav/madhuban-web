import { z } from 'zod';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const rl = await checkRateLimit(request);
  if (rl.limited) {
    return NextResponse.json(
      { error: 'rate_limited', retry_after: rl.retryAfter },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
  }

  // TODO Phase 5: write to Supabase newsletter_subscribers + send via Resend
  return NextResponse.json({ ok: true, message: 'Subscribed' });
}
