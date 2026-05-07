import "server-only";
import { Resend } from "resend";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

// Client is created per-call so env vars are resolved at request time, not
// at module evaluation time (which would fail during `next build`).
export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailParams): Promise<void> {
  const client = new Resend(requireEnv("RESEND_API_KEY"));
  const from = requireEnv("RESEND_FROM_EMAIL");

  // Dev override: redirect all outgoing mail to a single address for testing.
  const devOverride = process.env.RESEND_DEV_OVERRIDE_TO;
  const actualTo = devOverride || to;
  const actualSubject = devOverride
    ? `[DEV → ${to}] ${subject}`
    : subject;

  const { error } = await client.emails.send({
    from,
    to: actualTo,
    subject: actualSubject,
    html,
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo } : {}),
  });
  if (error) throw new Error(error.message);
}
