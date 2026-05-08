import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { ConsentProvider } from "@/lib/consent/consent-context";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { R2_BASE } from "@/lib/r2";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const OG_IMAGE = `${R2_BASE}/branding/logo/madhuban-logo-full-md.webp`;

export const viewport: Viewport = {
  themeColor: "#2D3B2D",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.madhubanecoretreat.com"),
  title: {
    default: "Madhuban Eco Retreat — Forest Resort near Ratapani Tiger Reserve",
    template: "%s — Madhuban Eco Retreat",
  },
  description:
    "Eco-luxury forest resort 60 km from Bhopal, adjacent to Ratapani Tiger Reserve. Safari tents, mud houses, pool villa, glamping, dining & nature experiences.",
  icons: {
    icon: [
      { url: `${R2_BASE}/branding/logo/favicon.ico`, sizes: "any" },
      { url: `${R2_BASE}/branding/logo/android-chrome-192x192.png`, sizes: "192x192", type: "image/png" },
      { url: `${R2_BASE}/branding/logo/android-chrome-512x512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: { url: `${R2_BASE}/branding/logo/apple-touch-icon.png`, sizes: "180x180" },
    shortcut: `${R2_BASE}/branding/logo/favicon.ico`,
  },
  openGraph: {
    siteName: "Madhuban Eco Retreat",
    locale: "en_IN",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Madhuban Eco Retreat — Eco-Luxury Forest Resort near Bhopal" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased overflow-x-clip`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://checkout.razorpay.com" />
      </head>
      <body className="min-h-full flex flex-col">
          <ConsentProvider>
            {children}
            <CookieBanner />
            <GoogleAnalytics />
          </ConsentProvider>
        </body>
    </html>
  );
}
