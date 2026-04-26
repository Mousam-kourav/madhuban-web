"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Mail } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-[var(--color-forest-green)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-5 h-5 text-[var(--color-forest-green)]" />
          </div>
          <h3 className="font-display italic text-2xl text-[var(--color-charcoal)] mb-2">
            Check your inbox
          </h3>
          <p className="font-body text-sm text-[var(--color-charcoal)]/70">
            We sent a sign-in link to{" "}
            <span className="font-medium text-[var(--color-charcoal)]">
              {email}
            </span>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-charcoal)]/60 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@madhuban.estate"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] font-body text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30 focus:border-[var(--color-earth-brown)] transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="font-body text-xs text-[var(--color-error)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 rounded-xl bg-[var(--color-forest-green)] text-[var(--color-ivory)] font-body font-medium text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Send magic link"}
          </button>
        </form>
      )}
    </div>
  );
}
