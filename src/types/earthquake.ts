/**
 * TypeScript interfaces for USGS Earthquake GeoJSON API
 * These are the domain types shared across the application
 */

export interface EarthquakeProperties {
  mag: number | null; // Magnitude
  place: string | null; // Location description
  time: number; // Unix timestamp in milliseconds
  updated: number; // Last updated timestamp
  tz: number | null; // Timezone offset
  url: string; // USGS event page URL
  detail: string; // GeoJSON detail URL
  felt: number | null; // Number of felt reports
  cdi: number | null; // Community decimal intensity
  mmi: number | null; // Modified Mercalli Intensity
  alert: string | null; // PAGER alert level (green, yellow, orange, red)
  status: string; // Review status
  tsunami: number; // Tsunami flag (0 or 1)
  sig: number; // Significance (0-1000)
  net: string; // Network source
  code: string; // Event code
  ids: string; // Event IDs
  sources: string; // Network sources
  types: string; // Product types
  nst: number | null; // Number of stations
  dmin: number | null; // Distance to nearest station
  rms: number | null; // Root mean square travel time residual
  gap: number | null; // Azimuthal gap
  magType: string | null; // Magnitude type
  type: string; // Event type
  title: string; // Full title
}

export interface EarthquakeGeometry {
  type: 'Point';
  coordinates: [number, number, number]; // [longitude, latitude, depth in km]
}

export interface EarthquakeFeature {
  type: 'Feature';
  properties: EarthquakeProperties;
  geometry: EarthquakeGeometry;
  id: string;
}

export interface EarthquakeMetadata {
  generated: number; // Time response was generated
  url: string; // API URL
  title: string; // Feed title
  status: number; // HTTP status code
  api: string; // API version
  count: number; // Number of earthquakes
}

export interface EarthquakeResponse {
  type: 'FeatureCollection';
  metadata: EarthquakeMetadata;
  features: EarthquakeFeature[];
  bbox?: [number, number, number, number, number, number]; // Bounding box
}

/**
 * Extended response from our cached API
 * Includes cache metadata for the client
 */
export interface CachedEarthquakeResponse extends EarthquakeResponse {
  cachedAt: number; // When we last fetched from USGS
  cacheExpiresAt: number; // When the cache will expire
  stale?: boolean; // Whether this is stale cached data
}

/**
 * Filter types for earthquake queries
 */
export type MagnitudeFilter = 'all' | '1.0' | '2.5' | '4.5' | 'significant';
export type TimePeriodFilter = 'hour' | 'day' | 'week' | 'month';
