export interface ContactEnquiryData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function contactEnquiryEmail(data: ContactEnquiryData): { subject: string; html: string } {
  const subject = `New contact enquiry — ${data.name}`;

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
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:#FEFCF8;">New Contact Enquiry</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Name", data.name)}
              ${row("Email", `<a href="mailto:${data.email}" style="color:#6E6146;">${data.email}</a>`)}
              ${data.phone ? row("Phone", data.phone) : ""}
              ${row("Message", `<span style="white-space:pre-wrap;">${escapeHtml(data.message)}</span>`)}
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
    <td style="padding:8px 0;vertical-align:top;width:120px;">
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
