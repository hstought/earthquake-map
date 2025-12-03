import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Earthquake Map - Live Seismic Activity',
  description: 'Real-time earthquake visualization powered by USGS data. Track seismic activity worldwide with an interactive map.',
  keywords: ['earthquake', 'seismic', 'map', 'USGS', 'real-time', 'visualization'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster 
          richColors 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 15, 15, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
      </body>
    </html>
  );
}
