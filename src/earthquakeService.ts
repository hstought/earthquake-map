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
 * Generate popup content for an earthquake
 */
export function generatePopupContent(feature: EarthquakeFeature): string {
  const { properties, geometry } = feature;
  const [lng, lat, depth] = geometry.coordinates;
  const mag = properties.mag !== null ? properties.mag.toFixed(1) : 'N/A';
  const magColor = getMagnitudeColor(properties.mag);
  
  return `
    <div class="earthquake-popup">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <div style="
          width: 36px; 
          height: 36px; 
          border-radius: 50%; 
          background: ${magColor}; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        ">${mag}</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: white;">${properties.place || 'Unknown location'}</div>
          <div style="font-size: 12px; color: #9ca3af;">${formatTime(properties.time)}</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
        <div>
          <span style="color: #6b7280;">Depth:</span>
          <span style="color: #d1d5db; margin-left: 4px;">${formatDepth(depth)}</span>
        </div>
        <div>
          <span style="color: #6b7280;">Coords:</span>
          <span style="color: #d1d5db; margin-left: 4px;">${lat.toFixed(2)}°, ${lng.toFixed(2)}°</span>
        </div>
      </div>
      ${properties.tsunami === 1 ? `
        <div style="margin-top: 8px; padding: 6px 10px; background: rgba(239, 68, 68, 0.2); border-radius: 6px; font-size: 12px; color: #fca5a5;">
          ⚠️ Tsunami warning issued
        </div>
      ` : ''}
      <a href="${properties.url}" target="_blank" rel="noopener noreferrer" style="
        display: block;
        margin-top: 10px;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        text-align: center;
        font-size: 12px;
        color: #f97316;
        text-decoration: none;
        transition: background 0.2s;
      " onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
        View on USGS →
      </a>
    </div>
  `;
}
