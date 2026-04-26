import { createAdminClient } from "@/lib/supabase/admin";
import { PostEditor } from "../../post-editor";
import { notFound } from "next/navigation";
import type { BlogPost } from "@/lib/blog/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return <PostEditor post={data as BlogPost} />;
}
