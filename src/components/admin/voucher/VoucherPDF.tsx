import path from "path";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { fmtINR } from "@/lib/gst";

// outputFileTracingIncludes in next.config.ts ensures Vercel bundles these woff files.
const NOTO_FILES = path.join(process.cwd(), "node_modules/@fontsource/noto-sans/files");
Font.register({
  family: "Noto Sans",
  fonts: [
    { src: path.join(NOTO_FILES, "noto-sans-latin-400-normal.woff"), fontWeight: 400 },
    { src: path.join(NOTO_FILES, "noto-sans-latin-700-normal.woff"), fontWeight: 700 },
  ],
});
Font.register({
  family: "Noto Sans Devanagari",
  fonts: [
    { src: path.join(NOTO_FILES, "noto-sans-devanagari-400-normal.woff"), fontWeight: 400 },
    { src: path.join(NOTO_FILES, "noto-sans-devanagari-700-normal.woff"), fontWeight: 700 },
  ],
});

const FONT_STACK: [string, string] = ["Noto Sans", "Noto Sans Devanagari"];

const s = StyleSheet.create({
  page: {
    fontFamily: FONT_STACK[0],
    fontSize: 10,
    color: "#2A2A2A",
    backgroundColor: "#FEFCF8",
    padding: 36,
  },
  header: {
    backgroundColor: "#2D3B2D",
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  headerProp: { fontSize: 8, letterSpacing: 1.5, color: "#D1C8C1", textTransform: "uppercase" },
  headerTitle: { fontSize: 20, fontWeight: 700, color: "#FEFCF8", marginTop: 4 },
  headerSub: { fontSize: 10, color: "#A8C5A0", marginTop: 2 },
  refBox: {
    borderRadius: 8,
    border: "1.5pt solid #6E6146",
    padding: 14,
    marginBottom: 16,
    alignItems: "center",
  },
  refLabel: { fontSize: 8, color: "#8B8578", letterSpacing: 1.2, textTransform: "uppercase" },
  refValue: { fontSize: 20, fontFamily: FONT_STACK[1], fontWeight: 700, color: "#6E6146", marginTop: 4, letterSpacing: 2 },
  refNote: { fontSize: 8, color: "#8B8578", marginTop: 4 },
  section: {
    borderRadius: 8,
    border: "1pt solid #EAE5DC",
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 8, color: "#8B8578", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { color: "#8B8578", fontSize: 9 },
  value: { fontWeight: 700, fontSize: 9, color: "#2A2A2A" },
  divider: { borderBottom: "0.5pt solid #EAE5DC", marginVertical: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  totalLabel: { fontWeight: 700, fontSize: 10, color: "#6E6146" },
  totalValue: { fontFamily: FONT_STACK[1], fontWeight: 700, fontSize: 12, color: "#6E6146" },
  banner: {
    backgroundColor: "#4A6741",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  bannerText: { color: "#FEFCF8", fontWeight: 700, fontSize: 11 },
  footer: { fontSize: 8, color: "#8B8578", textAlign: "center", marginTop: 20 },
});

export interface VoucherData {
  bookingRef: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: number;
}

function fmt(iso: string): string {
  const parts = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const m = Number(parts[1]) - 1;
  return `${parts[2]} ${months[m] ?? ""} ${parts[0]}`;
}

export function VoucherPDF({ data }: { data: VoucherData }) {
  return (
    <Document title={`Voucher-${data.bookingRef}`} author="Madhuban Eco Retreat">
      <Page size="A5" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerProp}>Madhuban Eco Retreat</Text>
          <Text style={s.headerTitle}>Booking Voucher</Text>
          <Text style={s.headerSub}>Show this at check-in</Text>
        </View>

        {/* Banner */}
        <View style={s.banner}>
          <Text style={s.bannerText}>✓  Payment Received in Full</Text>
        </View>

        {/* Booking Ref */}
        <View style={s.refBox}>
          <Text style={s.refLabel}>Booking Reference</Text>
          <Text style={s.refValue}>{data.bookingRef}</Text>
          <Text style={s.refNote}>Please present this reference at the front desk</Text>
        </View>

        {/* Stay Details */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Stay Details</Text>
          <View style={s.row}><Text style={s.label}>Guest</Text><Text style={s.value}>{data.guestName}</Text></View>
          <View style={s.row}><Text style={s.label}>Room</Text><Text style={s.value}>{data.roomName}</Text></View>
          <View style={s.row}><Text style={s.label}>Check-in</Text><Text style={s.value}>{fmt(data.checkIn)} · from 2:00 PM</Text></View>
          <View style={s.row}><Text style={s.label}>Check-out</Text><Text style={s.value}>{fmt(data.checkOut)} · by 11:00 AM</Text></View>
          <View style={s.row}><Text style={s.label}>Duration</Text><Text style={s.value}>{data.nights} night{data.nights !== 1 ? "s" : ""}</Text></View>
          <View style={s.row}>
            <Text style={s.label}>Guests</Text>
            <Text style={s.value}>
              {data.adults} adult{data.adults !== 1 ? "s" : ""}
              {data.children > 0 ? `, ${data.children} child${data.children !== 1 ? "ren" : ""}` : ""}
            </Text>
          </View>
          <View style={s.divider} />
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total Paid</Text>
            <Text style={s.totalValue}>{fmtINR(data.totalAmount)}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Location</Text>
          <Text style={{ fontSize: 9, color: "#2A2A2A", lineHeight: 1.6 }}>
            Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road{"\n"}
            Rehti, Sehore, Madhya Pradesh — 466446{"\n"}
            GPS: 22.88°N, 77.52°E · 60 km from Bhopal
          </Text>
        </View>

        <Text style={s.footer}>
          Madhuban Eco Retreat · +91 97705 58419 · madhubanecoretreat@gmail.com
        </Text>
      </Page>
    </Document>
  );
}
