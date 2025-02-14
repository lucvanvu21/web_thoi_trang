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
      <div className='my-14 container mx-auto'>{children}</div>
      <FooterC />
    </>
  );
}
