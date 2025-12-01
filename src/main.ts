import './style.css';
import L from 'leaflet';
import {
  fetchEarthquakes,
  getMagnitudeColor,
  getMagnitudeRadius,
  generatePopupContent,
  formatRelativeTime,
  type MagnitudeFilter,
  type TimePeriodFilter,
  type EarthquakeFeature
} from './earthquakeService';

// Fix Leaflet default icon path issue with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Constants
const AUTO_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds
const CARTO_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTO_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// State
let map: L.Map;
let markersLayer: L.LayerGroup;
let currentMagnitude: MagnitudeFilter = '2.5';
let currentPeriod: TimePeriodFilter = 'day';
let refreshTimer: number | null = null;

// DOM Elements
const magnitudeFilter = document.getElementById('magnitude-filter') as HTMLSelectElement;
const timeFilter = document.getElementById('time-filter') as HTMLSelectElement;
const earthquakeCount = document.getElementById('earthquake-count') as HTMLSpanElement;
const lastUpdated = document.getElementById('last-updated') as HTMLSpanElement;
const refreshIcon = document.getElementById('refresh-icon') as SVGElement;
const loadingOverlay = document.getElementById('loading-overlay') as HTMLDivElement;

/**
 * Initialize the Leaflet map with dark theme
 */
function initializeMap(): void {
  map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 18,
    worldCopyJump: true,
    zoomControl: true,
    zoomAnimation: true,
    zoomAnimationThreshold: 4,
    fadeAnimation: true,
    markerZoomAnimation: true
  });

  // Add dark CartoDB tile layer
  L.tileLayer(CARTO_DARK_TILES, {
    attribution: CARTO_ATTRIBUTION,
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Position zoom control
  map.zoomControl.setPosition('bottomright');

  // Initialize markers layer
  markersLayer = L.layerGroup().addTo(map);
}

/**
 * Create a circle marker for an earthquake
 */
function createEarthquakeMarker(feature: EarthquakeFeature): L.CircleMarker {
  const [lng, lat] = feature.geometry.coordinates;
  const magnitude = feature.properties.mag;
  
  const marker = L.circleMarker([lat, lng], {
    radius: getMagnitudeRadius(magnitude),
    fillColor: getMagnitudeColor(magnitude),
    color: 'rgba(255, 255, 255, 0.3)',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  });

  // Bind popup with custom content
  marker.bindPopup(generatePopupContent(feature), {
    maxWidth: 300,
    className: 'earthquake-popup-container'
  });

  // Add hover effect
  marker.on('mouseover', function() {
    this.setStyle({
      fillOpacity: 1,
      weight: 2,
      color: 'rgba(255, 255, 255, 0.6)'
    });
    this.bringToFront();
  });

  marker.on('mouseout', function() {
    this.setStyle({
      fillOpacity: 0.8,
      weight: 1,
      color: 'rgba(255, 255, 255, 0.3)'
    });
  });

  return marker;
}

/**
 * Load and display earthquake data
 */
async function loadEarthquakes(): Promise<void> {
  showLoading(true);
  startRefreshAnimation();

  try {
    const data = await fetchEarthquakes(currentMagnitude, currentPeriod);
    
    // Clear existing markers
    markersLayer.clearLayers();

    // Add new markers
    data.features.forEach((feature) => {
      const marker = createEarthquakeMarker(feature);
      markersLayer.addLayer(marker);
    });

    // Update UI stats
    updateStats(data.features.length, data.metadata.generated);

  } catch (error) {
    console.error('Failed to load earthquake data:', error);
    showError('Failed to load earthquake data. Please try again.');
  } finally {
    showLoading(false);
    stopRefreshAnimation();
  }
}

/**
 * Update statistics display
 */
function updateStats(count: number, timestamp: number): void {
  earthquakeCount.textContent = count.toString();
  lastUpdated.textContent = formatRelativeTime(timestamp);
}

/**
 * Show/hide loading overlay
 */
function showLoading(show: boolean): void {
  if (show) {
    loadingOverlay.classList.remove('hidden');
  } else {
    loadingOverlay.classList.add('hidden');
  }
}

/**
 * Start refresh icon animation
 */
function startRefreshAnimation(): void {
  refreshIcon.classList.add('animate-spin');
}

/**
 * Stop refresh icon animation
 */
function stopRefreshAnimation(): void {
  refreshIcon.classList.remove('animate-spin');
}

/**
 * Show error message
 */
function showError(message: string): void {
  // Create toast notification
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 right-4 z-[3000] bg-red-500/90 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm text-sm';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Remove after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

/**
 * Set up auto-refresh timer
 */
function setupAutoRefresh(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  
  refreshTimer = window.setInterval(() => {
    console.log('Auto-refreshing earthquake data...');
    loadEarthquakes();
  }, AUTO_REFRESH_INTERVAL);
}

/**
 * Handle filter changes
 */
function setupFilterListeners(): void {
  magnitudeFilter.addEventListener('change', (e) => {
    currentMagnitude = (e.target as HTMLSelectElement).value as MagnitudeFilter;
    loadEarthquakes();
  });

  timeFilter.addEventListener('change', (e) => {
    currentPeriod = (e.target as HTMLSelectElement).value as TimePeriodFilter;
    loadEarthquakes();
  });
}

/**
 * Initialize the application
 */
async function init(): Promise<void> {
  initializeMap();
  setupFilterListeners();
  setupAutoRefresh();
  await loadEarthquakes();
}

// Start the app
init();
