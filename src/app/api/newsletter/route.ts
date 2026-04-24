import { z } from 'zod';
import { NextResponse } from 'next/server';

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
  }

  // TODO Phase 5: write to Supabase newsletter_subscribers + send via Resend
  return NextResponse.json({ ok: true, message: 'Subscribed' });
}
