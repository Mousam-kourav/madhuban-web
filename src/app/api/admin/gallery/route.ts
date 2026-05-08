import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { assertRole } from '@/lib/admin/auth';
import { adminGetGalleryItems } from '@/lib/gallery/queries';

export async function GET(request: NextRequest) {
  const auth = await assertRole('admin');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') ?? undefined;
  const type = searchParams.get('type') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const q = searchParams.get('q') ?? undefined;
  const sortBy = (searchParams.get('sortBy') as 'sort_order' | 'uploaded_at_desc' | 'uploaded_at_asc') ?? undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 100;
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

  try {
    const items = await adminGetGalleryItems({ category, type, status, q, sortBy, limit, offset });
    return NextResponse.json(items);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
