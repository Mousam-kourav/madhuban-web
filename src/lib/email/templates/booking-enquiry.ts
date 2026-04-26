export const ROOM_DISPLAY_NAMES: Record<string, string> = {
  "safari-tent": "Safari Tent",
  "mud-house-1": "Mud House 1 (with bathtub)",
  "mud-house-2": "Mud House 2",
  "pool-side-villa": "Pool Side Villa",
  "glamping-tents": "Glamping Tent",
  "camping-tent": "Camping Tent",
};

export interface BookingEnquiryData {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomType: string;
  specialRequests?: string;
}

export function bookingEnquiryEmail(data: BookingEnquiryData): { subject: string; html: string } {
  const roomLabel = ROOM_DISPLAY_NAMES[data.roomType] ?? data.roomType;
  const nights = nightsBetween(data.checkIn, data.checkOut);
  const subject = `New booking enquiry — ${data.name}, ${formatDate(data.checkIn)} to ${formatDate(data.checkOut)}, ${roomLabel}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #EAE5DC;">
        <!-- Header -->
        <tr>
          <td style="background:#6E6146;padding:24px 32px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#D1C8C1;">Madhuban Eco Retreat</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:#FEFCF8;">New Booking Enquiry</h1>
          </td>
        </tr>
        <!-- Stay summary band -->
        <tr>
          <td style="background:#F5F0E8;padding:16px 32px;border-bottom:1px solid #EAE5DC;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#6E6146;font-weight:600;">${escapeHtml(roomLabel)}</td>
                <td align="right" style="font-size:13px;color:#2A2A2A;">${formatDate(data.checkIn)} → ${formatDate(data.checkOut)}<span style="color:#8B8578;font-size:12px;"> (${nights} night${nights !== 1 ? "s" : ""})</span></td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Name", escapeHtml(data.name))}
              ${row("Email", `<a href="mailto:${data.email}" style="color:#6E6146;">${data.email}</a>`)}
              ${row("Phone", escapeHtml(data.phone))}
              ${row("Room", escapeHtml(roomLabel))}
              ${row("Check-in", formatDate(data.checkIn))}
              ${row("Check-out", `${formatDate(data.checkOut)} (${nights} night${nights !== 1 ? "s" : ""})`)}
              ${row("Guests", `${data.adults} adult${data.adults !== 1 ? "s" : ""}${data.children > 0 ? `, ${data.children} child${data.children !== 1 ? "ren" : ""}` : ""}`)}
              ${data.specialRequests ? row("Special requests", `<span style="white-space:pre-wrap;">${escapeHtml(data.specialRequests)}</span>`) : ""}
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#FAF7F2;padding:16px 32px;border-top:1px solid #EAE5DC;">
            <p style="margin:0;font-size:11px;color:#8B8578;">Reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;vertical-align:top;width:130px;">
      <span style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#8B8578;">${label}</span>
    </td>
    <td style="padding:8px 0;vertical-align:top;">
      <span style="font-size:14px;color:#2A2A2A;">${value}</span>
    </td>
  </tr>
  <tr><td colspan="2" style="padding:0;border-bottom:1px solid #EAE5DC;height:1px;"></td></tr>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const m = Number(month) - 1;
  return `${day} ${months[m] ?? ""} ${year}`;
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / 86400000));
}
