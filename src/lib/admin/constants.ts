/**
 * Centralized admin email. Reads from process.env.ADMIN_EMAIL with a hardcoded fallback.
 * Legacy: process.env.CONTACT_FORM_TO was used in older code paths and has been retired —
 * remove it from Vercel env vars during cleanup.
 */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'madhubanecoretreat@gmail.com';
