import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Earthquake Map',
  description: 'Real-time earthquake visualization powered by USGS data. Track seismic activity worldwide with an interactive map.',
  keywords: ['earthquake', 'seismic', 'map', 'USGS', 'real-time', 'visualization'],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
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
