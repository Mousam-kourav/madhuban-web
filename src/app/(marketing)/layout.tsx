import { Header } from '@/components/marketing/header';
import { Footer } from '@/components/marketing/footer';
import { WhatsAppFloater } from '@/components/marketing/whatsapp-floater';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFloater />
    </>
  );
}
