import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

// Configure Inter font with next/font for optimal loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Earthquake Map',
  description:
    'Real-time earthquake visualization powered by USGS data. Track seismic activity worldwide with an interactive map.',
  keywords: ['earthquake', 'seismic', 'map', 'USGS', 'real-time', 'visualization'],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster
          richColors
          position="bottom-right"
          toastOptions={{
            className: 'toast-theme',
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
