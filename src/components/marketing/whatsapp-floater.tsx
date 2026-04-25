'use client';

import { BUSINESS } from '@/lib/content/business';
import { IconWhatsApp } from '@/components/ui/social-icons';
import { useConsent } from '@/lib/consent/consent-context';

const phone = BUSINESS.phone.replace(/\D/g, '');
const message = encodeURIComponent("Hi, I'd like to know more about Madhuban Eco Retreat.");
const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

export function WhatsAppFloater() {
  const { isLoaded, state } = useConsent();

  // Hide while cookie banner is visible — prevents bottom overlap on mobile
  if (isLoaded && state === null) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center justify-center size-14 rounded-full bg-[#25D366] shadow-lg transition-all duration-200 ease-out hover:bg-[#20BA5A] hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2 animate-float-in"
    >
      <IconWhatsApp className="size-7 text-white" />
    </a>
  );
}
