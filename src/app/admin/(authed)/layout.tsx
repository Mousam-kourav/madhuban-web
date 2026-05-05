import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/ui/Sidebar';
import { TopBar } from '@/components/admin/ui/TopBar';
import { AdminToaster } from '@/components/admin/ui/AdminToaster';

export default async function AuthedLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="flex min-h-screen bg-admin-canvas-bg">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full">
          {children}
        </main>
      </div>
      <AdminToaster />
    </div>
  );
}
