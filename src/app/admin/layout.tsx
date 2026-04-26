import type { ReactNode } from "react";

export const metadata = {
  title: "Admin — Madhuban Eco Retreat",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
