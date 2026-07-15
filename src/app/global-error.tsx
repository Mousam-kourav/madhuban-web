"use client";

import { useEffect } from "react";

// This boundary replaces the root layout, so it renders its own <html>/<body>
// and cannot rely on globals.css being present. Styles are inline on purpose:
// this is the last line of defence and must render unaided.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/global-error] root layout render failed:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FBF8F1",
          color: "#2F2E2B",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          padding: "2rem",
        }}
      >
        <main style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 0.75rem",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(94, 75, 60, 0.6)",
            }}
          >
            Madhuban Eco Retreat
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 500,
              lineHeight: 1.2,
            }}
          >
            Something Went Wrong
          </h1>
          <p
            style={{
              marginTop: "1.25rem",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "rgba(47, 46, 43, 0.7)",
            }}
          >
            The site failed to load. Please try again in a moment.
          </p>
          {error.digest && (
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.75rem",
                color: "rgba(47, 46, 43, 0.4)",
              }}
            >
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              height: "3rem",
              padding: "0 2rem",
              border: "none",
              borderRadius: "0.375rem",
              backgroundColor: "#5E4B3C",
              color: "#FFFEF9",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </main>
      </body>
    </html>
  );
}
