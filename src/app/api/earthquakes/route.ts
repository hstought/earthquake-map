import { NextResponse } from 'next/server';
import type { EarthquakeResponse, MagnitudeFilter, TimePeriodFilter } from '@/types/earthquake';

/**
 * Internal cache structure for storing USGS API responses
 */
interface CachedData {
  data: EarthquakeResponse;
  fetchedAt: number; // Unix timestamp when we fetched from USGS
}

// In-memory cache (persists across requests in the same serverless instance)
// For Vercel, this works within a single instance's lifetime
const cache: Map<string, CachedData> = new Map();

// Fixed refresh times in EST: midnight, 6 AM, noon, 6 PM
const REFRESH_HOURS_EST = [0, 6, 12, 18];

/**
 * Get the most recent refresh time boundary in EST
 * Returns a timestamp for when the cache should have last been refreshed
 */
function getLastRefreshBoundary(): number {
  const now = new Date();

  // Convert to EST (UTC-5)
  const estOffset = -5 * 60; // EST offset in minutes
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const estMinutes = utcMinutes + estOffset;

  // Calculate EST hour (handle day wrap)
  let estHour = Math.floor(estMinutes / 60);
  let dayOffset = 0;
  if (estHour < 0) {
    estHour += 24;
    dayOffset = -1; // Previous day in EST
  } else if (estHour >= 24) {
    estHour -= 24;
    dayOffset = 1;
  }

  // Find the most recent refresh hour
  let lastRefreshHour = REFRESH_HOURS_EST[0]; // Default to midnight
  for (const hour of REFRESH_HOURS_EST) {
    if (estHour >= hour) {
      lastRefreshHour = hour;
    }
  }

  // If current EST hour is before midnight (0), use 18:00 from previous day
  if (estHour < REFRESH_HOURS_EST[0]) {
    lastRefreshHour = 18;
    dayOffset -= 1;
  }

  // Build the refresh boundary timestamp
  const boundary = new Date(now);
  boundary.setUTCHours(lastRefreshHour + 5, 0, 0, 0); // Convert EST hour back to UTC
  boundary.setUTCDate(boundary.getUTCDate() + dayOffset);

  // If the boundary is in the future (due to rounding), go back 6 hours
  if (boundary.getTime() > now.getTime()) {
    boundary.setUTCHours(boundary.getUTCHours() - 6);
  }

  return boundary.getTime();
}

/**
 * Get the next refresh time boundary for cache expiration
 */
function getNextRefreshBoundary(): number {
  const lastRefresh = getLastRefreshBoundary();
  return lastRefresh + 6 * 60 * 60 * 1000; // Add 6 hours
}

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const magnitudeParam = searchParams.get('magnitude') || '2.5';
  const periodParam = searchParams.get('period') || 'day';

  // Validate parameters
  if (!isValidMagnitude(magnitudeParam) || !isValidPeriod(periodParam)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const cacheKey = `${magnitudeParam}_${periodParam}`;
  const lastRefreshBoundary = getLastRefreshBoundary();
  const nextRefreshBoundary = getNextRefreshBoundary();

  // Calculate seconds until next refresh for cache headers
  const secondsUntilNextRefresh = Math.max(
    1,
    Math.floor((nextRefreshBoundary - Date.now()) / 1000)
  );

  // Check if we have cached data from the current refresh period
  const cached = cache.get(cacheKey);
  if (cached && cached.fetchedAt >= lastRefreshBoundary) {
    // Return cached data - it's still valid for this refresh period
    return NextResponse.json(
      {
        ...cached.data,
        cachedAt: cached.fetchedAt,
        cacheExpiresAt: nextRefreshBoundary,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${secondsUntilNextRefresh}, stale-while-revalidate=3600`,
        },
      }
    );
  }

  // Fetch fresh data from USGS
  try {
    const url = buildFeedUrl(magnitudeParam, periodParam);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data: EarthquakeResponse = await response.json();
    const fetchedAt = Date.now();

    // Store in cache
    cache.set(cacheKey, { data, fetchedAt });

    return NextResponse.json(
      {
        ...data,
        cachedAt: fetchedAt,
        cacheExpiresAt: nextRefreshBoundary,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${secondsUntilNextRefresh}, stale-while-revalidate=3600`,
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch from USGS:', error);

    // If we have stale cached data, return it
    if (cached) {
      return NextResponse.json({
        ...cached.data,
        cachedAt: cached.fetchedAt,
        cacheExpiresAt: nextRefreshBoundary,
        stale: true,
      });
    }

    return NextResponse.json({ error: 'Failed to fetch earthquake data' }, { status: 500 });
  }
}
