export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: TiptapDoc | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category: string | null;
  tags: string[] | null;
  seo_title: string | null;
  meta_description: string | null;
  status: BlogStatus;
  published_at: string | null;
  read_time_minutes: number | null;
  author_name: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogPostSummary = Pick<
  BlogPost,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "cover_image_url"
  | "cover_image_alt"
  | "category"
  | "published_at"
  | "read_time_minutes"
  | "author_name"
>;

export interface TiptapDoc {
  type: "doc";
  content?: TiptapNode[];
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
}

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}
