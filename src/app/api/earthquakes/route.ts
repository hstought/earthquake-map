import { NextResponse } from 'next/server';
import type { EarthquakeResponse, MagnitudeFilter, TimePeriodFilter } from '@/types/earthquake';

/**
 * Cache duration in seconds
 * Data will be revalidated after this period
 */
const CACHE_DURATION_SECONDS = 600; // 10 minutes

// Base URL for USGS real-time feeds
const USGS_FEED_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

function buildFeedUrl(magnitude: MagnitudeFilter, period: TimePeriodFilter): string {
  const magPart = magnitude === 'all' ? 'all' : magnitude;
  return `${USGS_FEED_BASE}/${magPart}_${period}.geojson`;
}

function isValidMagnitude(value: string): value is MagnitudeFilter {
  return ['all', '1.0', '2.5', '4.5', 'significant'].includes(value);
}

function isValidPeriod(value: string): value is TimePeriodFilter {
  return ['hour', 'day', 'week', 'month'].includes(value);
}

/**
 * Fetch earthquake data from USGS with Next.js built-in caching
 * 
 * Uses Next.js fetch caching which works properly on Vercel:
 * - Caches responses at the edge for the specified duration
 * - Automatically revalidates after cache expires
 * - Shared across all users (no redundant API calls)
 */
async function fetchFromUSGS(
  magnitude: MagnitudeFilter,
  period: TimePeriodFilter
): Promise<EarthquakeResponse> {
  const url = buildFeedUrl(magnitude, period);

  const response = await fetch(url, {
    next: {
      revalidate: CACHE_DURATION_SECONDS,
      tags: [`earthquakes-${magnitude}-${period}`],
    },
  });

  if (!response.ok) {
    throw new Error(`USGS API error: ${response.status}`);
  }

  return response.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const magnitudeParam = searchParams.get('magnitude') || '2.5';
  const periodParam = searchParams.get('period') || 'day';

  // Validate parameters
  if (!isValidMagnitude(magnitudeParam) || !isValidPeriod(periodParam)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const data = await fetchFromUSGS(magnitudeParam, periodParam);
    
    // The USGS API includes metadata.generated which tells us when the data was generated
    // We use this as the "cachedAt" time since it reflects the data freshness
    const cachedAt = data.metadata?.generated ?? Date.now();
    const cacheExpiresAt = cachedAt + CACHE_DURATION_SECONDS * 1000;

    return NextResponse.json(
      {
        ...data,
        cachedAt,
        cacheExpiresAt,
      },
      {
        headers: {
          // Browser cache: allow stale content while revalidating
          'Cache-Control': `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=60`,
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch from USGS:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earthquake data' },
      { status: 500 }
    );
  }
}
