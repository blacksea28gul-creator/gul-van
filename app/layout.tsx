import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atatürk ile Röportaj - Kurtuluş Savaşı Tarih Chatbotu',
  description: 'Tarih dersi için Mustafa Kemal Atatürk ile birinci şahıs ağzından Kurtuluş Savaşı dönemine dair eğitici röportaj chatbotu.',
  openGraph: {
    title: 'Atatürk ile Röportaj - Kurtuluş Savaşı Tarih Chatbotu',
    description: 'Tarih dersi için Mustafa Kemal Atatürk ile birinci şahıs ağzından Kurtuluş Savaşı dönemine dair eğitici röportaj chatbotu.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atatürk ile Röportaj - Kurtuluş Savaşı Tarih Chatbotu',
    description: 'Tarih dersi için Mustafa Kemal Atatürk ile birinci şahıs ağzından Kurtuluş Savaşı dönemine dair eğitici röportaj chatbotu.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="bg-[#F8F5F0] text-[#1A1A1A] antialiased selection:bg-[#C8102E] selection:text-white">
        {children}
      </body>
    </html>
  );
}
