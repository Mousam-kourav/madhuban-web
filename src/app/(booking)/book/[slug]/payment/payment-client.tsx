"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { formatPrice } from "@/lib/utils";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal: { ondismiss?: () => void };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

interface OrderData {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  totalAmountRupees: number;
  bookingRef: string;
  prefill: { name: string; email: string; contact: string };
}

interface Props {
  bookingId: string;
  roomSlug: string;
  totalAmountRupees: number;
  guestName: string;
  guestEmail: string;
  guestMobile: string;
  roomName: string;
  bookingRef: string;
}

export function PaymentClient({
  bookingId,
  roomSlug,
  totalAmountRupees,
  guestName,
  guestEmail,
  guestMobile,
  bookingRef,
}: Props) {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    void (async () => {
      try {
        const res = await fetch("/api/booking/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });
        const data = (await res.json()) as OrderData & { error?: string };
        if (!res.ok) {
          setOrderError(data.error ?? "Could not prepare payment. Please try again.");
        } else {
          setOrderData(data);
        }
      } catch {
        setOrderError("Network error. Please refresh and try again.");
      } finally {
        setLoadingOrder(false);
      }
    })();
  }, [bookingId]);

  const handlePay = () => {
    if (!orderData || !scriptReady || typeof window.Razorpay === "undefined") return;
    setPayError("");
    setPaying(true);

    const rzp = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: "Madhuban Eco Retreat",
      description: `Booking payment — ${orderData.bookingRef}`,
      prefill: {
        name: guestName,
        email: guestEmail,
        contact: guestMobile,
      },
      theme: { color: "#6E6146" },
      modal: {
        ondismiss: () => setPaying(false),
      },
      handler: async (response) => {
        try {
          const verifyRes = await fetch("/api/booking/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const verifyData = (await verifyRes.json()) as { ok?: boolean; bookingRef?: string; error?: string };
          if (verifyData.ok && verifyData.bookingRef) {
            router.push(`/book/confirmation?ref=${verifyData.bookingRef}`);
          } else {
            setPayError(verifyData.error ?? "Payment verification failed. Please contact us.");
            setPaying(false);
          }
        } catch {
          setPayError("Verification failed. Please contact us with your payment ID.");
          setPaying(false);
        }
      },
    });
    rzp.open();
  };

  if (loadingOrder) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-earth-brown border-t-transparent" />
          <p className="font-body text-sm text-muted-foreground">Preparing secure payment…</p>
        </div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="font-body text-sm text-red-600">{orderError}</p>
        <a
          href={`/stay/${roomSlug}`}
          className="mt-4 inline-block font-body text-sm text-earth-brown underline-offset-4 hover:underline"
        >
          ← Back to room
        </a>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-earth-brown/10">
              <svg className="h-7 w-7 text-earth-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
              Booking Confirmed — Payment Required
            </p>
            <div className="mt-2 rounded-lg border border-border bg-warm-beige/30 px-4 py-2">
              <p className="font-body text-xs text-muted-foreground">Reference</p>
              <p className="font-body text-lg font-semibold tracking-wider text-earth-brown">{bookingRef}</p>
            </div>
          </div>

          <div className="mb-6 rounded-xl bg-cream p-4">
            <div className="flex items-center justify-between font-body text-sm">
              <span className="text-charcoal/70">Total amount</span>
              <span className="text-xl font-semibold text-charcoal">
                ₹{formatPrice(totalAmountRupees)}
              </span>
            </div>
            <p className="mt-2 font-body text-xs text-muted-foreground">
              Full payment collected now. No balance due at check-in.
            </p>
          </div>

          {payError && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">
              {payError}
            </p>
          )}

          <p className="mb-3 text-center font-body text-xs text-charcoal/70">
            Free cancellation up to 7 days before check-in — full refund, no questions asked.
          </p>

          <button
            onClick={handlePay}
            disabled={paying || !scriptReady || !orderData}
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-earth-brown font-body text-base font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
          >
            {paying ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory border-t-transparent" />
                Processing…
              </>
            ) : !scriptReady ? (
              "Loading payment…"
            ) : (
              `Pay ₹${formatPrice(totalAmountRupees)}`
            )}
          </button>

          {/* Trust strip — three rows */}
          <ul
            className="mt-5 space-y-2 font-body text-xs text-charcoal/70"
            aria-label="Payment security and policies"
          >
            <li className="flex items-center gap-2">
              {/* Inline Razorpay mark (no external CDN) */}
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M14.3 3l-4.4 8.2h3l-3.2 9.8L17.9 9.2h-3L18 3z"
                  fill="#3395FF"
                />
              </svg>
              <span>Secured by Razorpay — UPI, Cards, Net Banking, Wallets</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 text-earth-brown"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <rect x="4" y="10" width="16" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 10V7a4 4 0 018 0v3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>PCI-DSS compliant · 256-bit TLS encryption</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 text-earth-brown"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  d="M5 12l4 4L19 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Free cancellation up to 7 days before check-in</span>
            </li>
          </ul>

          <div className="mt-4 border-t border-border pt-4">
            <a
              href={`https://wa.me/919770558419?text=${encodeURIComponent(`Hi, I have a booking at Madhuban Eco Retreat (ref: ${bookingRef}). Need help with payment.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center font-body text-xs text-earth-brown underline-offset-4 hover:underline"
            >
              Need help? WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
