import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { ADMIN_EMAIL } from "@/lib/admin/constants";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'Body must be array of {id, sort_order}' }, { status: 400 });
  }

  const admin = createAdminClient();
  await Promise.all(
    (body as { id: string; sort_order: number }[]).map(({ id, sort_order }) =>
      admin.from('souvenirs').update({ sort_order }).eq('id', id),
    ),
  );

  return NextResponse.json({ ok: true });
}
