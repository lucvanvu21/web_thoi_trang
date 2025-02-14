import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import ProviderWrapper from '@/components/sessionProvider';
import { Toaster } from '@/components/ui/toaster';
import { baseOpenGraph } from './share-meta';
import Script from 'next/script';
import ProgressProviders from '@/components/progressBar';

const geistSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['vietnamese'],
});

const geistMono = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['vietnamese'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | hangthoitrang',
    default: 'HangThoiTrang - Thời trang hàng ngày ',
  },
  description:
    'hangthoitrang - Website thời trang với đa dạng mẫu hàng',  keywords: [
    'hangthoitrang',
    'quần áo'
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://hangthoitrang.online'),
  // authors: [{ name: 'Tên tác giả' }],
  openGraph: {
    ...baseOpenGraph,
    title: 'hangthoitrang',
    description: 'Nhiều bộ thời trang hot nhất thị trường!',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://hangthoitrang.online',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/bg.jpg`,
        alt: 'mua hàng tại hangthoitrang.online',
      },
    ],
  },
  facebook: {
    appId: '1153863292449405',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://hangthoitrang.online',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-MBFSNMJ35Z" strategy="afterInteractive"></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-MBFSNMJ35Z');
    `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster />
        <ProgressProviders>
          <ProviderWrapper>{children}</ProviderWrapper>
        </ProgressProviders>
      </body>
    </html>
  );
}
