export interface BookingConfirmationData {
  bookingRef: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: number;
  advanceAmount: number;
  balanceDue: number;
  specialRequests?: string | null;
}

export function bookingConfirmationGuestEmail(
  data: BookingConfirmationData,
): { subject: string; html: string } {
  const subject = `Your Madhuban booking is confirmed — ${data.bookingRef}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #EAE5DC;">
        <tr>
          <td style="background:#2D3B2D;padding:24px 32px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#D1C8C1;">Madhuban Eco Retreat</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:#FEFCF8;">Booking Confirmed</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#4A6741;padding:12px 32px;">
            <p style="margin:0;font-size:13px;color:#FEFCF8;">
              ✓ &nbsp;Your advance payment has been received. Your stay is confirmed.
            </p>
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
              ${row("Guest", escapeHtml(data.guestName))}
              ${row("Room", escapeHtml(data.roomName))}
              ${row("Check-in", formatDate(data.checkIn))}
              ${row("Check-out", formatDate(data.checkOut))}
              ${row("Duration", `${data.nights} night${data.nights !== 1 ? "s" : ""}`)}
              ${row("Guests", `${data.adults} adult${data.adults !== 1 ? "s" : ""}${data.children > 0 ? `, ${data.children} child${data.children !== 1 ? "ren" : ""}` : ""}`)}
              ${data.specialRequests ? row("Special requests", `<span style="white-space:pre-wrap;">${escapeHtml(data.specialRequests)}</span>`) : ""}
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:#FAF7F2;border-radius:8px;border:1px solid #EAE5DC;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#8B8578;">Payment Summary</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#2A2A2A;padding:4px 0;">Total Stay Amount</td>
                      <td align="right" style="font-size:13px;font-weight:600;color:#2A2A2A;">₹${formatAmount(data.totalAmount)}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#4A6741;padding:4px 0;">Advance Paid (50%)</td>
                      <td align="right" style="font-size:13px;font-weight:600;color:#4A6741;">₹${formatAmount(data.advanceAmount)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding:4px 0;border-top:1px solid #EAE5DC;"></td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#6E6146;padding:4px 0;font-weight:600;">Balance Due at Check-in</td>
                      <td align="right" style="font-size:14px;font-weight:700;color:#6E6146;">₹${formatAmount(data.balanceDue)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:#F5F0E8;border-radius:8px;border:1px solid #EAE5DC;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#8B8578;">Getting Here</p>
                  <p style="margin:0 0 4px;font-size:13px;color:#2A2A2A;">Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road, Rehti, Sehore, MP — 466446</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#2A2A2A;">📍 60 km from Bhopal · GPS: 22.88°N, 77.52°E</p>
                </td>
              </tr>
            </table>

            <p style="margin-top:24px;font-size:13px;color:#2A2A2A;line-height:1.6;">
              Need help? WhatsApp us at <a href="https://wa.me/919770558419" style="color:#6E6146;">+91 97705 58419</a>
              or email <a href="mailto:madhubanresort@somaiya.com" style="color:#6E6146;">madhubanresort@somaiya.com</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#FAF7F2;padding:16px 32px;border-top:1px solid #EAE5DC;">
            <p style="margin:0;font-size:11px;color:#8B8578;">Madhuban Eco Retreat (A Somaiya Group Initiative) · +91 97705 58419</p>
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
    <td style="padding:8px 0;vertical-align:top;width:140px;">
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
