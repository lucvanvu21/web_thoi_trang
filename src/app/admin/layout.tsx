import { SideBarAdmin } from '@/components/layout/sideBarAdmin';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <SideBarAdmin />
        <main className="w-full ">
          <SidebarTrigger />
          <div className="p-4">{children}</div>
        </main>
      </SidebarProvider>
    </>
  );
}
