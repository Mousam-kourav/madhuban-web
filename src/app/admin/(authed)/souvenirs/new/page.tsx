import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { SouvenirForm } from '../souvenir-form';

export default function NewSouvenirPage() {
  return (
    <div>
      <Link
        href="/admin/souvenirs"
        className="mb-6 inline-flex items-center gap-1 font-body text-sm text-[var(--color-earth-brown)] hover:text-[var(--color-charcoal)]"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Souvenir Shop
      </Link>
      <h1 className="mb-8 font-display italic text-4xl text-[var(--color-charcoal)]">
        New Product
      </h1>
      <div className="max-w-2xl rounded-2xl border border-[var(--color-border)] bg-white p-8">
        <SouvenirForm />
      </div>
    </div>
  );
}
