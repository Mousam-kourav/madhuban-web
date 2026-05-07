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
  inventory_count: number;
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

// guests table: id, name, mobile, email, id_type, id_number, gstin, address, created_at
type GuestRow = {
  id: string;
  name: string;
  mobile: string | null;
  email: string;
  id_type: string | null;
  id_number: string | null;
  gstin: string | null;
  address: string | null;
  created_at: string;
};

// coupons: valid_to (not valid_until), usage_limit (not max_uses), min_booking_value (not min_amount/min_nights)
type CouponRow = {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_booking_value: number;
  valid_from: string | null;
  valid_to: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
};

// pricing_rules: date_from/date_to (not start_date/end_date); no is_active, priority, name, min_nights
type PricingRuleRow = {
  id: string;
  room_id: string | null;
  rule_type: string;
  date_from: string | null;
  date_to: string | null;
  price_override: number | null;
  multiplier: number;
  created_at: string;
};

// manual_blocks: date_from/date_to (not start_date/end_date)
// Migration 0015: added notes text null
type ManualBlockRow = {
  id: string;
  room_id: string;
  date_from: string;
  date_to: string;
  reason: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
};

// bookings: booking_ref (not reference_number), checkin/checkout (not check_in/check_out),
// num_adults/num_children (not adults/children), guest_id FK (not guest_name/email/phone),
// payment_status; no nights/price_per_night/gst_rate/coupon_id/advance_amount/balance_due/razorpay_*
// Migration 0011: added staff_notes jsonb, cancellation_reason text, cancelled_at timestamptz
// Migration 0012: added corporate_gstin, corporate_company_name, corporate_address, addons jsonb
// Migration 0013: added assigned_unit text
type BookingRow = {
  id: string;
  booking_ref: string;
  room_id: string;
  guest_id: string;
  checkin: string;
  checkout: string;
  num_adults: number;
  num_children: number;
  status: string;
  source: string;
  payment_status: string;
  base_amount: number;
  gst_amount: number;
  total_amount: number;
  special_requests: string | null;
  internal_notes: string | null;
  staff_notes: Json;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  coupon_code: string | null;
  discount_amount: number;
  corporate_gstin: string | null;
  corporate_company_name: string | null;
  corporate_address: string | null;
  addons: Json;
  assigned_unit: string | null;
  created_at: string;
  updated_at: string;
};

// payments: booking_id, razorpay_order_id, razorpay_payment_id, amount, status, method, captured_at,
// payment_type (advance|balance), refund_amount, refunded_at
// Migration 0011: added reference_number text, notes text
type PaymentRow = {
  id: string;
  booking_id: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  amount: number;
  status: string;
  payment_type: string;
  method: string | null;
  reference_number: string | null;
  notes: string | null;
  captured_at: string | null;
  refund_amount: number;
  refunded_at: string | null;
  created_at: string;
};

// invoices: full A7 GST-compliant schema (replaces A3 placeholder)
export type InvoiceRow = {
  id: string;
  invoice_number: string;
  fy: string;
  serial_number: number;
  booking_id: string;
  issuer_legal_name: string;
  issuer_trade_name: string;
  issuer_gstin: string;
  issuer_address: string;
  issuer_state: string;
  bill_to_name: string;
  bill_to_phone: string | null;
  bill_to_email: string | null;
  bill_to_address: string | null;
  bill_to_state: string | null;
  bill_to_gstin: string | null;
  bill_to_company_name: string | null;
  service_period_from: string;
  service_period_to: string;
  place_of_supply_state: string;
  place_of_supply_state_code: string;
  is_inter_state: boolean;
  gst_rate_percent: number;
  taxable_amount: number;
  cgst_rate: number | null;
  cgst_amount: number | null;
  sgst_rate: number | null;
  sgst_amount: number | null;
  igst_rate: number | null;
  igst_amount: number | null;
  total_gst_amount: number;
  total_amount: number;
  line_items: Json;
  status: string;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  generated_by: string;
  generated_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type InvoiceCounterRow = {
  fy: string;
  last_serial: number;
  updated_at: string;
};

export type SouvenirRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string | null;
  long_description: string | null;
  price: number | null;
  show_price: boolean;
  cover_image: string | null;
  detail_image_2: string | null;
  detail_image_3: string | null;
  artisan_credit: string | null;
  is_active: boolean;
  deleted_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// audit_log: admin_user_id (not user_id), entity_type/entity_id (not entity/entity_id), details (not before/after_json)
type AuditLogRow = {
  id: string;
  admin_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Json | null;
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
          inventory_count?: number;
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
      guests: {
        Row: GuestRow;
        Insert: {
          email: string;
          name: string;
          id?: string;
          created_at?: string;
          mobile?: string | null;
          id_type?: string | null;
          id_number?: string | null;
          gstin?: string | null;
          address?: string | null;
        };
        Update: Partial<GuestRow>;
        Relationships: [];
      };
      coupons: {
        Row: CouponRow;
        Insert: Omit<CouponRow, "id" | "created_at" | "used_count"> &
          Partial<Pick<CouponRow, "id" | "created_at" | "used_count">>;
        Update: Partial<CouponRow>;
        Relationships: [];
      };
      pricing_rules: {
        Row: PricingRuleRow;
        Insert: Omit<PricingRuleRow, "id" | "created_at"> &
          Partial<Pick<PricingRuleRow, "id" | "created_at">>;
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
          booking_ref: string;
          room_id: string;
          guest_id: string;
          checkin: string;
          checkout: string;
          num_adults: number;
          num_children: number;
          base_amount: number;
          gst_amount: number;
          total_amount: number;
          status: string;
          source: string;
          payment_status: string;
          // Optional / nullable
          id?: string;
          created_at?: string;
          updated_at?: string;
          discount_amount?: number;
          coupon_code?: string | null;
          special_requests?: string | null;
          internal_notes?: string | null;
          staff_notes?: unknown;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          // Migration 0012: A4 corporate + add-ons
          corporate_gstin?: string | null;
          corporate_company_name?: string | null;
          corporate_address?: string | null;
          addons?: unknown;
          assigned_unit?: string | null;
        };
        Update: Partial<BookingRow>;
        Relationships: [];
      };
      payments: {
        Row: PaymentRow;
        Insert: {
          booking_id: string;
          amount: number;
          status: string;
          id?: string;
          created_at?: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          payment_type?: string;
          method?: string | null;
          reference_number?: string | null;
          notes?: string | null;
          captured_at?: string | null;
          refund_amount?: number;
          refunded_at?: string | null;
        };
        Update: Partial<PaymentRow>;
        Relationships: [];
      };
      invoices: {
        Row: InvoiceRow;
        Insert: Omit<InvoiceRow, 'id' | 'created_at' | 'updated_at' | 'generated_at' | 'place_of_supply_state' | 'place_of_supply_state_code' | 'status'> &
          Partial<Pick<InvoiceRow, 'id' | 'created_at' | 'updated_at' | 'generated_at' | 'place_of_supply_state' | 'place_of_supply_state_code' | 'status'>>;
        Update: Partial<InvoiceRow>;
        Relationships: [];
      };
      invoice_counters: {
        Row: InvoiceCounterRow;
        Insert: { fy: string; last_serial?: number; updated_at?: string };
        Update: Partial<InvoiceCounterRow>;
        Relationships: [];
      };
      souvenirs: {
        Row: SouvenirRow;
        Insert: {
          name: string;
          slug: string;
          category: string;
          id?: string;
          short_description?: string | null;
          long_description?: string | null;
          price?: number | null;
          show_price?: boolean;
          cover_image?: string | null;
          detail_image_2?: string | null;
          detail_image_3?: string | null;
          artisan_credit?: string | null;
          is_active?: boolean;
          deleted_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<SouvenirRow>;
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
    Functions: {
      increment_invoice_counter: {
        Args: { p_fy: string };
        Returns: number;
      };
      create_invoice_atomic: {
        Args: {
          p_booking_id: string;
          p_issuer: Json;
          p_bill_to: Json;
          p_service: Json;
          p_tax: Json;
          p_line_items: Json;
          p_generated_by: string;
        };
        Returns: Json;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
