import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen">
      {/* Left — forest hero panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10">
        {/* Hero image with WebP + JPG fallback */}
        <picture className="absolute inset-0">
          <source
            srcSet="https://pub-988c0a6b938742458b908a7a49295f61.r2.dev/home/rooms/pool-side-villa-4-1280.webp"
            type="image/webp"
          />
          <img
            src="https://pub-988c0a6b938742458b908a7a49295f61.r2.dev/home/rooms/pool-side-villa-4-1280.jpg"
            alt="Swimming pool at Madhuban Eco Retreat at golden hour"
            className="w-full h-full object-cover"
          />
        </picture>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

        {/* Top-left logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-[var(--color-forest-green)] rounded-xl p-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            >
              <path d="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8z" />
              <path d="M12 6v8M9 9l3-3 3 3" />
            </svg>
          </div>
          <div>
            <p className="text-[var(--color-ivory)] font-body font-semibold tracking-widest text-xs uppercase">
              Madhuban
            </p>
            <p className="text-[var(--color-ivory)]/70 font-body text-xs tracking-widest uppercase">
              Eco Retreat Admin
            </p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center">
          <h1 className="font-display italic text-5xl text-[var(--color-ivory)] leading-tight mb-4">
            Manage your
            <br />
            forest retreat
          </h1>
          <p className="text-[var(--color-ivory)]/70 font-body text-base max-w-sm mx-auto leading-relaxed">
            A sanctuary for management, where every detail of the estate is
            nurtured with intentionality and quiet grace.
          </p>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex justify-between items-end">
          <p className="text-[var(--color-ivory)]/60 font-body text-xs tracking-widest uppercase">
            Est. 2023
          </p>
          <p className="text-[var(--color-ivory)]/60 font-body text-xs tracking-widest uppercase">
            Coordinates: 22.88°&nbsp;N, 77.52°&nbsp;E
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[var(--color-cream)] px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-display italic text-4xl text-[var(--color-earth-brown)] mb-2">
              Welcome Back
            </h2>
            <p className="font-body text-[var(--color-charcoal)]/70 text-sm">
              Please enter your administrative credentials to continue.
            </p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center font-body text-xs text-[var(--color-muted)]">
            Having trouble logging in? Contact System Administrator
          </p>
        </div>
      </div>
    </div>
  );
}
