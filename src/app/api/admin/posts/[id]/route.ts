import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

type BlogPostUpdate =
  Database["public"]["Tables"]["blog_posts"]["Update"];

const ADMIN_EMAIL = "madhubanecoretreat@gmail.com";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let rawBody: Record<string, unknown>;
  try {
    rawBody = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Get old row for revalidation and published_at logic
  const { data: old } = await supabase
    .from("blog_posts")
    .select("slug, status, published_at")
    .eq("id", id)
    .single();

  // Set published_at when publishing for the first time
  if (
    rawBody.status === "published" &&
    old?.status !== "published" &&
    !old?.published_at
  ) {
    rawBody.published_at = new Date().toISOString();
  }

  const update = rawBody as BlogPostUpdate;

  const { data, error } = await supabase
    .from("blog_posts")
    .update(update)
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Revalidate public blog pages
  revalidatePath("/blogs");
  if (old?.slug) revalidatePath(`/blogs/${old.slug}`);
  if (data?.slug && data.slug !== old?.slug) {
    revalidatePath(`/blogs/${data.slug}`);
  }

  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/blogs");
  if (post?.slug) revalidatePath(`/blogs/${post.slug}`);

  return new NextResponse(null, { status: 204 });
}
