import { z } from 'zod';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { createAdminClient } from '@/lib/supabase/admin';
import { createNotification } from '@/lib/admin/notifications';

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

  const email = parsed.data.email;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { email, subscribed_at: new Date().toISOString(), unsubscribed_at: null, source: 'homepage' },
      { onConflict: 'email' },
    );

  if (error) {
    console.error('[newsletter] upsert failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }

  // Non-fatal notification
  try {
    await createNotification({
      type: 'newsletter_subscribed',
      title: 'New Newsletter Subscriber',
      body: `${email} subscribed via the homepage.`,
    });
  } catch (err) {
    console.error('[newsletter] notification failed:', err);
  }

  return NextResponse.json({ ok: true, message: 'Subscribed' });
}
