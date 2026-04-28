import Link from "next/link";
import Image from "next/image";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Minimal booking header */}
      <header className="sticky top-0 z-40 border-b border-border bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
          <Link
            href="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_R2_BASE ?? ""}/logo/madhuban-logo.webp`}
              alt="Madhuban Eco Retreat"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <Link
            href="/stay"
            className="font-body text-sm text-earth-brown underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
          >
            ← Back to Rooms
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border py-6 text-center font-body text-xs text-muted-foreground">
        <p>
          Questions?{" "}
          <a
            href="https://wa.me/919770558419"
            target="_blank"
            rel="noopener noreferrer"
            className="text-earth-brown underline-offset-4 hover:underline"
          >
            WhatsApp us
          </a>{" "}
          · +91 97705 58419
        </p>
      </footer>
    </div>
  );
}
