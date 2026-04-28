import type { BookingCancelledGuestData } from "./booking-cancelled-guest";

export interface AdminBookingCancelledData extends BookingCancelledGuestData {
  guestEmail: string;
  guestMobile: string;
  cancelledBy: string;
}

export function bookingCancelledAdminEmail(
  data: AdminBookingCancelledData,
): { subject: string; html: string } {
  const subject = `Booking cancelled — ${data.guestName} | ${data.bookingRef}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #EAE5DC;">
        <tr>
          <td style="background:#B84A4A;padding:24px 32px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#FEFCF8;opacity:0.7;">Madhuban Admin</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:#FEFCF8;">Booking Cancelled</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Booking Ref", escapeHtml(data.bookingRef))}
              ${row("Guest Name", escapeHtml(data.guestName))}
              ${row("Email", `<a href="mailto:${data.guestEmail}" style="color:#6E6146;">${data.guestEmail}</a>`)}
              ${row("Mobile", escapeHtml(data.guestMobile))}
              ${row("Room", escapeHtml(data.roomName))}
              ${row("Check-in", formatDate(data.checkIn))}
              ${row("Check-out", formatDate(data.checkOut))}
              ${row("Cancelled By", escapeHtml(data.cancelledBy))}
              ${data.refundAmount > 0 ? row("Refund Amount", `<strong style="color:#4A6741;">₹${formatAmount(data.refundAmount)}</strong> — process in Razorpay dashboard`) : row("Refund", "No refund")}
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#FAF7F2;padding:16px 32px;border-top:1px solid #EAE5DC;">
            <p style="margin:0;font-size:11px;color:#8B8578;">Process any applicable refund in the Razorpay dashboard, then mark the payment row as refunded in the admin panel.</p>
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
