-- ============================================================
-- A7 Part 1: Invoices schema + atomic numbering functions
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE,
  fy text NOT NULL,
  serial_number int NOT NULL,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,

  -- Legal entity snapshot (immutable after creation)
  issuer_legal_name text NOT NULL,
  issuer_trade_name text NOT NULL,
  issuer_gstin text NOT NULL,
  issuer_address text NOT NULL,
  issuer_state text NOT NULL,

  -- Guest billing snapshot (immutable after creation)
  bill_to_name text NOT NULL,
  bill_to_phone text,
  bill_to_email text,
  bill_to_address text,
  bill_to_state text,
  bill_to_gstin text,
  bill_to_company_name text,

  -- Service period
  service_period_from date NOT NULL,
  service_period_to date NOT NULL,
  place_of_supply_state text NOT NULL DEFAULT 'Madhya Pradesh',
  place_of_supply_state_code text NOT NULL DEFAULT '23',

  -- Tax computation
  is_inter_state boolean NOT NULL,
  gst_rate_percent numeric(5,2) NOT NULL,
  taxable_amount numeric(12,2) NOT NULL,
  cgst_rate numeric(5,2),
  cgst_amount numeric(12,2),
  sgst_rate numeric(5,2),
  sgst_amount numeric(12,2),
  igst_rate numeric(5,2),
  igst_amount numeric(12,2),
  total_gst_amount numeric(12,2) NOT NULL,
  total_amount numeric(12,2) NOT NULL,

  -- Line items array (immutable after creation)
  -- Shape: [{ description, hsn, qty, rate, amount }]
  line_items jsonb NOT NULL,

  -- Status
  status text NOT NULL DEFAULT 'ISSUED',
  cancellation_reason text,
  cancelled_at timestamptz,

  -- Metadata
  generated_by text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_booking ON invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_fy_serial ON invoices(fy, serial_number);
CREATE INDEX IF NOT EXISTS idx_invoices_generated_at ON invoices(generated_at DESC);

-- ── Invoice counters (one row per FY) ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invoice_counters (
  fy text PRIMARY KEY,
  last_serial int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE invoice_counters IS
  'Atomic counter for invoice serial numbers per financial year. Updated only via increment_invoice_counter() to prevent race conditions and gaps.';

-- ── Atomic counter increment ──────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_invoice_counter(p_fy text)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE
  v_serial int;
BEGIN
  INSERT INTO invoice_counters (fy, last_serial, updated_at)
    VALUES (p_fy, 1, now())
  ON CONFLICT (fy) DO UPDATE
    SET last_serial = invoice_counters.last_serial + 1,
        updated_at = now()
  RETURNING last_serial INTO v_serial;
  RETURN v_serial;
END;
$$;

-- ── Atomic invoice creation (counter + insert in one transaction) ─────────────

CREATE OR REPLACE FUNCTION create_invoice_atomic(
  p_booking_id uuid,
  p_issuer jsonb,
  p_bill_to jsonb,
  p_service jsonb,
  p_tax jsonb,
  p_line_items jsonb,
  p_generated_by text
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_fy text;
  v_serial int;
  v_invoice_number text;
  v_invoice_id uuid;
BEGIN
  v_fy := (p_service->>'fy');
  v_serial := increment_invoice_counter(v_fy);
  v_invoice_number := 'MADH/INV/' || v_fy || '/' || lpad(v_serial::text, 4, '0');

  INSERT INTO invoices (
    invoice_number, fy, serial_number, booking_id,
    issuer_legal_name, issuer_trade_name, issuer_gstin, issuer_address, issuer_state,
    bill_to_name, bill_to_phone, bill_to_email, bill_to_address, bill_to_state,
    bill_to_gstin, bill_to_company_name,
    service_period_from, service_period_to, place_of_supply_state,
    is_inter_state, gst_rate_percent, taxable_amount,
    cgst_rate, cgst_amount, sgst_rate, sgst_amount,
    igst_rate, igst_amount, total_gst_amount, total_amount,
    line_items, generated_by
  ) VALUES (
    v_invoice_number, v_fy, v_serial, p_booking_id,
    p_issuer->>'legal_name', p_issuer->>'trade_name', p_issuer->>'gstin',
    p_issuer->>'address', p_issuer->>'state',
    p_bill_to->>'name', p_bill_to->>'phone', p_bill_to->>'email',
    p_bill_to->>'address', p_bill_to->>'state', p_bill_to->>'gstin',
    p_bill_to->>'company_name',
    (p_service->>'from')::date, (p_service->>'to')::date,
    COALESCE(p_service->>'place_of_supply_state', 'Madhya Pradesh'),
    (p_tax->>'is_inter_state')::boolean, (p_tax->>'gst_rate')::numeric,
    (p_tax->>'taxable')::numeric,
    NULLIF(p_tax->>'cgst_rate', '')::numeric, NULLIF(p_tax->>'cgst_amount', '')::numeric,
    NULLIF(p_tax->>'sgst_rate', '')::numeric, NULLIF(p_tax->>'sgst_amount', '')::numeric,
    NULLIF(p_tax->>'igst_rate', '')::numeric, NULLIF(p_tax->>'igst_amount', '')::numeric,
    (p_tax->>'total_gst')::numeric, (p_tax->>'total')::numeric,
    p_line_items, p_generated_by
  ) RETURNING id INTO v_invoice_id;

  RETURN jsonb_build_object('invoice_id', v_invoice_id, 'invoice_number', v_invoice_number);
END;
$$;
