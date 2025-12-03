// TypeScript interfaces for USGS Earthquake GeoJSON API

export interface EarthquakeProperties {
  mag: number | null;           // Magnitude
  place: string | null;         // Location description
  time: number;                 // Unix timestamp in milliseconds
  updated: number;              // Last updated timestamp
  tz: number | null;            // Timezone offset
  url: string;                  // USGS event page URL
  detail: string;               // GeoJSON detail URL
  felt: number | null;          // Number of felt reports
  cdi: number | null;           // Community decimal intensity
  mmi: number | null;           // Modified Mercalli Intensity
  alert: string | null;         // PAGER alert level (green, yellow, orange, red)
  status: string;               // Review status
  tsunami: number;              // Tsunami flag (0 or 1)
  sig: number;                  // Significance (0-1000)
  net: string;                  // Network source
  code: string;                 // Event code
  ids: string;                  // Event IDs
  sources: string;              // Network sources
  types: string;                // Product types
  nst: number | null;           // Number of stations
  dmin: number | null;          // Distance to nearest station
  rms: number | null;           // Root mean square travel time residual
  gap: number | null;           // Azimuthal gap
  magType: string | null;       // Magnitude type
  type: string;                 // Event type
  title: string;                // Full title
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
  generated: number;            // Time response was generated
  url: string;                  // API URL
  title: string;                // Feed title
  status: number;               // HTTP status code
  api: string;                  // API version
  count: number;                // Number of earthquakes
}

export interface EarthquakeResponse {
  type: 'FeatureCollection';
  metadata: EarthquakeMetadata;
  features: EarthquakeFeature[];
  bbox?: [number, number, number, number, number, number]; // Bounding box
}

// Filter types
export type MagnitudeFilter = 'all' | '1.0' | '2.5' | '4.5' | 'significant';
export type TimePeriodFilter = 'hour' | 'day' | 'week' | 'month';

// Base URL for USGS real-time feeds
const USGS_FEED_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

/**
 * Build the USGS feed URL based on magnitude and time period filters
 */
export function buildFeedUrl(magnitude: MagnitudeFilter, period: TimePeriodFilter): string {
  const magPart = magnitude === 'all' ? 'all' : magnitude;
  return `${USGS_FEED_BASE}/${magPart}_${period}.geojson`;
}

/**
 * Fetch earthquake data from USGS
 */
export async function fetchEarthquakes(
  magnitude: MagnitudeFilter = '2.5',
  period: TimePeriodFilter = 'day'
): Promise<EarthquakeResponse> {
  const url = buildFeedUrl(magnitude, period);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch earthquake data: ${response.status} ${response.statusText}`);
  }
  
  const data: EarthquakeResponse = await response.json();
  return data;
}

/**
 * Get color for earthquake marker based on magnitude
 */
export function getMagnitudeColor(magnitude: number | null): string {
  if (magnitude === null) return '#888888';
  if (magnitude < 2) return '#22c55e';      // Green - minor
  if (magnitude < 3) return '#84cc16';      // Lime
  if (magnitude < 4) return '#eab308';      // Yellow
  if (magnitude < 5) return '#f97316';      // Orange
  if (magnitude < 6) return '#ef4444';      // Red
  if (magnitude < 7) return '#dc2626';      // Dark red
  return '#7f1d1d';                          // Very dark red - major
}

/**
 * Get radius for earthquake marker based on magnitude
 */
export function getMagnitudeRadius(magnitude: number | null): number {
  if (magnitude === null) return 4;
  // Scale radius from 4 to 25 based on magnitude 0-8+
  return Math.max(4, Math.min(25, 4 + magnitude * 2.5));
}

/**
 * Format timestamp to readable string
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Format depth to readable string
 */
export function formatDepth(depth: number): string {
  return `${depth.toFixed(1)} km`;
}

/**
 * Get depth description
 */
export function getDepthDescription(depth: number): string {
  if (depth < 70) return 'Shallow';
  if (depth < 300) return 'Intermediate';
  return 'Deep';
}
