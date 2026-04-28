import type { BookingConfirmationData } from "./booking-confirmation-guest";

export interface AdminBookingConfirmationData extends BookingConfirmationData {
  guestEmail: string;
  guestMobile: string;
  source: string;
}

export function bookingConfirmationAdminEmail(
  data: AdminBookingConfirmationData,
): { subject: string; html: string } {
  const subject = `New booking confirmed — ${data.guestName} | ${data.bookingRef}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #EAE5DC;">
        <tr>
          <td style="background:#6E6146;padding:24px 32px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#D1C8C1;">Madhuban Admin</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:#FEFCF8;">New Booking Confirmed</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#F5F0E8;padding:16px 32px;border-bottom:1px solid #EAE5DC;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#6E6146;font-weight:600;">${escapeHtml(data.roomName)}</td>
                <td align="right" style="font-size:13px;color:#2A2A2A;">
                  ${formatDate(data.checkIn)} → ${formatDate(data.checkOut)}
                  <span style="color:#8B8578;font-size:12px;"> (${data.nights} night${data.nights !== 1 ? "s" : ""})</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Booking Ref", `<strong style="font-size:16px;letter-spacing:0.06em;color:#6E6146;">${escapeHtml(data.bookingRef)}</strong>`)}
              ${row("Guest Name", escapeHtml(data.guestName))}
              ${row("Email", `<a href="mailto:${data.guestEmail}" style="color:#6E6146;">${data.guestEmail}</a>`)}
              ${row("Mobile", escapeHtml(data.guestMobile))}
              ${row("Room", escapeHtml(data.roomName))}
              ${row("Check-in", formatDate(data.checkIn))}
              ${row("Check-out", formatDate(data.checkOut))}
              ${row("Nights", String(data.nights))}
              ${row("Guests", `${data.adults} adult${data.adults !== 1 ? "s" : ""}${data.children > 0 ? `, ${data.children} child${data.children !== 1 ? "ren" : ""}` : ""}`)}
              ${row("Source", escapeHtml(data.source))}
              ${data.specialRequests ? row("Special requests", `<span style="white-space:pre-wrap;">${escapeHtml(data.specialRequests)}</span>`) : ""}
              ${row("Total Amount", `₹${formatAmount(data.totalAmount)}`)}
              ${row("Advance Received", `₹${formatAmount(data.advanceAmount)}`)}
              ${row("Balance at Check-in", `<strong style="color:#6E6146;">₹${formatAmount(data.balanceDue)}</strong>`)}
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#FAF7F2;padding:16px 32px;border-top:1px solid #EAE5DC;">
            <p style="margin:0;font-size:11px;color:#8B8578;">Log in to the admin panel to view and manage this booking.</p>
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
    <td style="padding:8px 0;vertical-align:top;width:150px;">
      <span style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#8B8578;">${label}</span>
    </td>
    <td style="padding:8px 0;vertical-align:top;">
      <span style="font-size:14px;color:#2A2A2A;">${value}</span>
    </td>
  </tr>
  <tr><td colspan="2" style="padding:0;border-bottom:1px solid #EAE5DC;height:1px;"></td></tr>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatDate(iso: string): string {
  const parts = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const m = Number(parts[1]) - 1;
  return `${parts[2]} ${months[m] ?? ""} ${parts[0]}`;
}

function formatAmount(n: number): string {
  return n.toLocaleString("en-IN");
}
