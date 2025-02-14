import FooterC from '@/components/layout/footer';
import Header from '@/components/layout/header';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="container mx-auto px-2 lg:px-32 mt-[90px]">{children}</div>
      <FooterC />
    </>
  );
}
