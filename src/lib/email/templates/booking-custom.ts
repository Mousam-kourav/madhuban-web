export interface BookingCustomEmailData {
  subject: string;
  body: string;
  guestName: string;
  bookingRef: string;
  emailSignature: string;
}

export function bookingCustomEmail(
  data: BookingCustomEmailData,
): { subject: string; html: string; text: string } {
  const bodyHtml = escapeHtml(data.body).replace(/\n/g, "<br>");
  const signatureHtml = escapeHtml(data.emailSignature).replace(/\n/g, "<br>");

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
            <p style="margin:4px 0 0;font-size:12px;color:#D1C8C1;">Re: Booking ${escapeHtml(data.bookingRef)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:14px;color:#2A2A2A;">Dear ${escapeHtml(data.guestName)},</p>
            <div style="font-size:14px;color:#2A2A2A;line-height:1.7;white-space:pre-wrap;">${bodyHtml}</div>
            <div style="margin-top:32px;padding-top:16px;border-top:1px solid #EAE5DC;font-size:13px;color:#6E6146;line-height:1.7;">
              ${signatureHtml}
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#FAF7F2;padding:16px 32px;border-top:1px solid #EAE5DC;">
            <p style="margin:0;font-size:11px;color:#8B8578;">Madhuban Eco Retreat · +91 97705 58419</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Dear ${data.guestName},\n\n${data.body}\n\n${data.emailSignature}`;

  return { subject: data.subject, html, text };
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
