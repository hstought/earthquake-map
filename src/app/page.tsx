'use client';

import dynamic from 'next/dynamic';
import LoadingOverlay from '@/components/LoadingOverlay';

// Dynamically import EarthquakeMap with SSR disabled (Leaflet requires window/document)
const EarthquakeMap = dynamic(
  () => import('@/components/EarthquakeMap'),
  { 
    ssr: false,
    loading: () => <LoadingOverlay isVisible={true} />,
  }
);

export default function Home() {
  return (
    <main className="w-full h-dvh">
      <EarthquakeMap />
    </main>
  );
}
