// Hand-maintained until: pnpm supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: Json | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category: string | null;
  tags: string[] | null;
  seo_title: string | null;
  meta_description: string | null;
  status: "draft" | "published";
  published_at: string | null;
  read_time_minutes: number | null;
  author_name: string | null;
  created_at: string;
  updated_at: string;
};

type RoomRow = {
  id: string;
  slug: string;
  name: string;
  description_short: string | null;
  description_long: string | null;
  max_occupancy: number;
  max_occupancy_children: number;
  base_price_per_night: number;
  gst_rate: number | null;
  peak_multiplier: number | null;
  amenities: Json | null;
  images: Json | null;
  is_active: boolean;
  min_nights: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  tagline: string | null;
  genre: string | null;
  href: string | null;
  hero_image: Json | null;
  long_description: Json | null;
  bed_config: string | null;
  size_label: string | null;
  highlights: Json | null;
  gallery: Json | null;
  seo_title: string | null;
  seo_description: string | null;
};

type RoomFaqRow = {
  id: string;
  room_id: string;
  question: string;
  answer: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type CouponRow = {
  id: string;
  code: string;
  discount_type: "percent" | "flat";
  discount_value: number;
  min_nights: number;
  min_amount: number;
  max_uses: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type PricingRuleRow = {
  id: string;
  room_id: string | null;
  name: string;
  rule_type: "seasonal" | "weekend" | "longstay" | "event";
  start_date: string | null;
  end_date: string | null;
  multiplier: number;
  min_nights: number | null;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ManualBlockRow = {
  id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_by: string | null;
  created_at: string;
};

type BookingRow = {
  id: string;
  reference_number: string;
  room_id: string;
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  price_per_night: number;
  base_amount: number;
  gst_rate: number;
  gst_amount: number;
  discount_amount: number;
  coupon_id: string | null;
  coupon_code: string | null;
  total_amount: number;
  advance_amount: number;
  balance_due: number;
  special_requests: string | null;
  status: "PENDING_PAYMENT" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED" | "NO_SHOW";
  source: "online" | "walk_in" | "phone" | "corporate";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  updated_at: string;
};

type PaymentRow = {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  payment_type: "advance" | "balance";
  payment_method: "razorpay" | "cash" | "bank_transfer" | "upi";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  status: "pending" | "captured" | "failed" | "refunded";
  refund_amount: number;
  refunded_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type InvoiceRow = {
  id: string;
  invoice_number: string;
  booking_id: string;
  invoice_type: "invoice" | "credit_note";
  pdf_url: string | null;
  amount: number;
  issued_at: string;
  created_at: string;
};

type AuditLogRow = {
  id: string;
  user_id: string;
  action: "create" | "update" | "delete" | "status_change";
  entity: string;
  entity_id: string;
  before_json: Json | null;
  after_json: Json | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: BlogPostRow;
        Insert: Omit<BlogPostRow, "id" | "created_at" | "updated_at"> &
          Partial<Pick<BlogPostRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<BlogPostRow>;
        Relationships: [];
      };
      rooms: {
        Row: RoomRow;
        Insert: {
          slug: string;
          name: string;
          base_price_per_night?: number;
          id?: string;
          created_at?: string;
          updated_at?: string;
          max_occupancy?: number;
          max_occupancy_children?: number;
          is_active?: boolean;
          sort_order?: number;
          description_short?: string | null;
          description_long?: string | null;
          gst_rate?: number | null;
          peak_multiplier?: number | null;
          amenities?: Json | null;
          images?: Json | null;
          min_nights?: number | null;
          tagline?: string | null;
          genre?: string | null;
          href?: string | null;
          hero_image?: Json | null;
          long_description?: Json | null;
          bed_config?: string | null;
          size_label?: string | null;
          highlights?: Json | null;
          gallery?: Json | null;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Update: Partial<RoomRow>;
        Relationships: [];
      };
      room_faqs: {
        Row: RoomFaqRow;
        Insert: {
          room_id: string;
          question: string;
          answer: string;
          id?: string;
          created_at?: string;
          updated_at?: string;
          display_order?: number;
        };
        Update: Partial<RoomFaqRow>;
        Relationships: [];
      };
      coupons: {
        Row: CouponRow;
        Insert: Omit<CouponRow, "id" | "created_at" | "updated_at" | "used_count"> &
          Partial<Pick<CouponRow, "id" | "created_at" | "updated_at" | "used_count">>;
        Update: Partial<CouponRow>;
        Relationships: [];
      };
      pricing_rules: {
        Row: PricingRuleRow;
        Insert: Omit<PricingRuleRow, "id" | "created_at" | "updated_at"> &
          Partial<Pick<PricingRuleRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<PricingRuleRow>;
        Relationships: [];
      };
      manual_blocks: {
        Row: ManualBlockRow;
        Insert: Omit<ManualBlockRow, "id" | "created_at"> &
          Partial<Pick<ManualBlockRow, "id" | "created_at">>;
        Update: Partial<ManualBlockRow>;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: {
          // Required
          reference_number: string;
          room_id: string;
          check_in: string;
          check_out: string;
          nights: number;
          adults: number;
          children: number;
          guest_name: string;
          guest_email: string;
          guest_phone: string;
          price_per_night: number;
          base_amount: number;
          gst_rate: number;
          gst_amount: number;
          total_amount: number;
          advance_amount: number;
          balance_due: number;
          status: "PENDING_PAYMENT" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED" | "NO_SHOW";
          source: "online" | "walk_in" | "phone" | "corporate";
          // Optional / nullable
          id?: string;
          created_at?: string;
          updated_at?: string;
          discount_amount?: number;
          coupon_id?: string | null;
          coupon_code?: string | null;
          special_requests?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
        };
        Update: Partial<BookingRow>;
        Relationships: [];
      };
      payments: {
        Row: PaymentRow;
        Insert: Omit<PaymentRow, "id" | "created_at" | "updated_at"> &
          Partial<Pick<PaymentRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<PaymentRow>;
        Relationships: [];
      };
      invoices: {
        Row: InvoiceRow;
        Insert: Omit<InvoiceRow, "id" | "created_at"> &
          Partial<Pick<InvoiceRow, "id" | "created_at">>;
        Update: Partial<InvoiceRow>;
        Relationships: [];
      };
      audit_log: {
        Row: AuditLogRow;
        Insert: Omit<AuditLogRow, "id" | "created_at"> &
          Partial<Pick<AuditLogRow, "id" | "created_at">>;
        Update: never;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
