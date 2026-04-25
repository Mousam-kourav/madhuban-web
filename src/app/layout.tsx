import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { ConsentProvider } from "@/lib/consent/consent-context";
import { CookieBanner } from "@/components/consent/cookie-banner";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.madhubanecoretreat.com"),
  title: {
    default: "Madhuban Eco Retreat — Forest Resort near Ratapani Tiger Reserve",
    template: "%s — Madhuban Eco Retreat",
  },
  description:
    "Eco-luxury forest resort 60 km from Bhopal, adjacent to Ratapani Tiger Reserve. Safari tents, mud houses, pool villa, glamping, dining & nature experiences.",
  openGraph: {
    siteName: "Madhuban Eco Retreat",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
          </ConsentProvider>
        </body>
    </html>
  );
}
