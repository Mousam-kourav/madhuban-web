"use client";

interface Props {
  id: string;
}

export function PrintControls({ id }: Props) {
  return (
    <div className="no-print fixed top-4 right-4 flex gap-2 z-50 print:hidden">
      <button
        onClick={() => window.print()}
        className="rounded-lg bg-[#3D4A2B] px-4 py-2 text-sm text-white hover:bg-[#2e3820]"
      >
        Print / Save PDF
      </button>
      <a
        href={`/api/admin/invoices/${id}/pdf`}
        className="rounded-lg border border-[#D9D4C8] bg-white px-4 py-2 text-sm text-[#2C2C2C] hover:bg-[#F5F5F0]"
      >
        Download PDF
      </a>
      <a
        href={`/admin/invoices/${id}`}
        className="rounded-lg border border-[#D9D4C8] bg-white px-4 py-2 text-sm text-[#2C2C2C] hover:bg-[#F5F5F0]"
      >
        ← Invoice Detail
      </a>
    </div>
  );
}
