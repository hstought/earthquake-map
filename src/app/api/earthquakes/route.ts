import { NextResponse } from 'next/server';

// TypeScript interfaces for USGS Earthquake GeoJSON API
interface EarthquakeMetadata {
  generated: number;
  url: string;
  title: string;
  status: number;
  api: string;
  count: number;
}

interface EarthquakeResponse {
  type: 'FeatureCollection';
  metadata: EarthquakeMetadata;
  features: unknown[];
  bbox?: [number, number, number, number, number, number];
}

interface CachedData {
  data: EarthquakeResponse;
  fetchedAt: number; // Unix timestamp when we fetched from USGS
}

// In-memory cache (persists across requests in the same serverless instance)
// For Vercel, this works within a single instance's lifetime
const cache: Map<string, CachedData> = new Map();

// Cache duration: 6 hours in milliseconds
const CACHE_DURATION = 6 * 60 * 60 * 1000;

// Base URL for USGS real-time feeds
const USGS_FEED_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

type MagnitudeFilter = 'all' | '1.0' | '2.5' | '4.5' | 'significant';
type TimePeriodFilter = 'hour' | 'day' | 'week' | 'month';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const magnitudeParam = searchParams.get('magnitude') || '2.5';
  const periodParam = searchParams.get('period') || 'day';
  
  // Validate parameters
  if (!isValidMagnitude(magnitudeParam) || !isValidPeriod(periodParam)) {
    return NextResponse.json(
      { error: 'Invalid parameters' },
      { status: 400 }
    );
  }
  
  const cacheKey = `${magnitudeParam}_${periodParam}`;
  const now = Date.now();
  
  // Check if we have valid cached data
  const cached = cache.get(cacheKey);
  if (cached && (now - cached.fetchedAt) < CACHE_DURATION) {
    // Return cached data with the actual fetch timestamp
    return NextResponse.json({
      ...cached.data,
      cachedAt: cached.fetchedAt,
      cacheExpiresAt: cached.fetchedAt + CACHE_DURATION,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
      },
    });
  }
  
  // Fetch fresh data from USGS
  try {
    const url = buildFeedUrl(magnitudeParam, periodParam);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }
    
    const data: EarthquakeResponse = await response.json();
    const fetchedAt = now;
    
    // Store in cache
    cache.set(cacheKey, { data, fetchedAt });
    
    return NextResponse.json({
      ...data,
      cachedAt: fetchedAt,
      cacheExpiresAt: fetchedAt + CACHE_DURATION,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Failed to fetch from USGS:', error);
    
    // If we have stale cached data, return it
    if (cached) {
      return NextResponse.json({
        ...cached.data,
        cachedAt: cached.fetchedAt,
        cacheExpiresAt: cached.fetchedAt + CACHE_DURATION,
        stale: true,
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch earthquake data' },
      { status: 500 }
    );
  }
}
