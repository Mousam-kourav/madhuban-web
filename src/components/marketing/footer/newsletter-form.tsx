'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-moss-green font-medium py-2">
        Thanks! You're subscribed. Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="newsletter-email" className="text-sm text-charcoal">
          Email address
        </Label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={status === 'loading'}
          aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
          className="bg-ivory border-border"
        />
        {status === 'error' && (
          <p id="newsletter-error" role="alert" className="text-xs text-error">
            {errorMsg}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="default"
        disabled={status === 'loading'}
        className="w-full"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </Button>

      <p className="text-xs text-muted-foreground leading-relaxed">
        By subscribing you agree to our{' '}
        <a href="/privacy-policy" className="underline hover:text-charcoal transition-colors">
          Privacy Policy
        </a>
        . Unsubscribe anytime.
      </p>
    </form>
  );
}
