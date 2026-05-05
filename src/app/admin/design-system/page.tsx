import type { Metadata } from 'next';
import { DesignSystemClient } from './design-system-client';

export const metadata: Metadata = {
  title: 'Design System — Madhuban Admin',
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return <DesignSystemClient />;
}
