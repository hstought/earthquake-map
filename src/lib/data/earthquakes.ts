/**
 * Data access functions for earthquake data
 *
 * This module handles fetching earthquake data from our cached API.
 * UI components should never call external APIs directly - they use these functions instead.
 */

import type {
  CachedEarthquakeResponse,
  MagnitudeFilter,
  TimePeriodFilter,
} from '@/types/earthquake';

/**
 * Fetch earthquake data from our cached API endpoint
 * The API caches USGS data to limit external API calls
 */
export async function fetchEarthquakes(
  magnitude: MagnitudeFilter = '2.5',
  period: TimePeriodFilter = 'day'
): Promise<CachedEarthquakeResponse> {
  const url = `/api/earthquakes?magnitude=${magnitude}&period=${period}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch earthquake data: ${response.status} ${response.statusText}`);
  }

  const data: CachedEarthquakeResponse = await response.json();
  return data;
}
