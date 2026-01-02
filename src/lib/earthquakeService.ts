/**
 * Earthquake utility functions
 * 
 * This module contains pure functions for formatting and transforming earthquake data.
 * Data fetching has been moved to lib/data/earthquakes.ts
 */

// Re-export types for backward compatibility during migration
export type {
  EarthquakeProperties,
  EarthquakeGeometry,
  EarthquakeFeature,
  EarthquakeMetadata,
  EarthquakeResponse,
  CachedEarthquakeResponse,
  MagnitudeFilter,
  TimePeriodFilter,
} from '@/types/earthquake';

// Re-export data fetching function for backward compatibility
export { fetchEarthquakes } from '@/lib/data/earthquakes';

// Base URL for USGS real-time feeds
const USGS_FEED_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

/**
 * Build the USGS feed URL based on magnitude and time period filters
 */
export function buildFeedUrl(magnitude: string, period: string): string {
  const magPart = magnitude === 'all' ? 'all' : magnitude;
  return `${USGS_FEED_BASE}/${magPart}_${period}.geojson`;
}

/**
 * Get color for earthquake marker based on magnitude
 * Uses a gradient from green (minor) to dark red (major)
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
 * Scales from 4px (minor) to 25px (major)
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
 * Format absolute date/time for cache display (e.g., "Dec 11, 3:45 PM")
 */
export function formatCacheTime(timestamp: number): string {
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
 * Format depth to readable string with unit
 */
export function formatDepth(depth: number): string {
  return `${depth.toFixed(1)} km`;
}

/**
 * Get depth description category
 */
export function getDepthDescription(depth: number): string {
  if (depth < 70) return 'Shallow';
  if (depth < 300) return 'Intermediate';
  return 'Deep';
}
