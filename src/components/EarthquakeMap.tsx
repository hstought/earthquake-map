'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { toast } from 'sonner';

import {
  fetchEarthquakes,
  getMagnitudeColor,
  getMagnitudeRadius,
  formatCacheTime,
  type MagnitudeFilter,
  type TimePeriodFilter,
  type EarthquakeFeature,
} from '@/lib/earthquakeService';

import FilterPanel from './FilterPanel';
import StatsBar from './StatsBar';
import MagnitudeLegend from './MagnitudeLegend';
import LoadingOverlay from './LoadingOverlay';
import EarthquakePopup from './EarthquakePopup';
import ThemeToggle from './ThemeToggle';
import { renderToString } from 'react-dom/server';

// Constants
const CARTO_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTO_LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const CARTO_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Map bounds - infinite horizontal (use very large values), limited vertical (poles)
// This allows infinite left/right panning while preventing scrolling past the poles
const INFINITE_HORIZONTAL_BOUNDS = L.latLngBounds(
  L.latLng(-85, -Infinity), // Southwest corner - infinite west
  L.latLng(85, Infinity)    // Northeast corner - infinite east
);

// Helper function to get wrapped longitudes for infinite horizontal scrolling
// This returns the original longitude plus offsets for adjacent world copies
function getWrappedLongitudes(lng: number): number[] {
  return [lng - 360, lng, lng + 360];
}

// Map configuration component for setting zoom control position
function MapConfig() {
  const map = useMap();
  
  useEffect(() => {
    map.zoomControl.setPosition('bottomright');
  }, [map]);
  
  return null;
}

// Individual earthquake marker component with hover effects (non-clustered version)
interface EarthquakeMarkerProps {
  feature: EarthquakeFeature;
  isNew: boolean;
}

function EarthquakeMarker({ feature, isNew }: EarthquakeMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showAnimation, setShowAnimation] = useState(isNew);
  const [lng, lat] = feature.geometry.coordinates;
  const magnitude = feature.properties.mag;
  
  const baseRadius = getMagnitudeRadius(magnitude);
  const radius = isHovered ? baseRadius * 1.3 : baseRadius;
  
  // Remove animation class after animation completes
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setShowAnimation(false), 600);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  return (
    <CircleMarker
      center={[lat, lng]}
      radius={radius}
      pathOptions={{
        fillColor: getMagnitudeColor(magnitude),
        color: isHovered ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)',
        weight: isHovered ? 2 : 1,
        opacity: 1,
        fillOpacity: isHovered ? 1 : 0.8,
        className: showAnimation ? 'marker-new' : '',
      }}
      eventHandlers={{
        mouseover: () => setIsHovered(true),
        mouseout: () => setIsHovered(false),
      }}
    >
      <Tooltip direction="top" offset={[0, -5]} opacity={0.9}>
        <span className="font-semibold">M {(magnitude ?? 0).toFixed(1)}</span>
      </Tooltip>
      <Popup maxWidth={300} className="earthquake-popup-container">
        <EarthquakePopup feature={feature} />
      </Popup>
    </CircleMarker>
  );
}

// Extended marker type with magnitude data
interface EarthquakeMarkerData {
  magnitude: number;
}

// Component that manages clustered markers using native Leaflet markercluster
interface ClusteredMarkersProps {
  earthquakes: EarthquakeFeature[];
}

function ClusteredMarkers({ earthquakes }: ClusteredMarkersProps) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    // Create cluster group if it doesn't exist
    if (!clusterGroupRef.current) {
      clusterGroupRef.current = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 60,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        disableClusteringAtZoom: 10,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          const childMarkers = cluster.getAllChildMarkers();
          
          // Calculate average magnitude from all child markers
          let totalMagnitude = 0;
          let validCount = 0;
          childMarkers.forEach((marker) => {
            const data = (marker as L.Marker & { earthquakeData?: EarthquakeMarkerData }).earthquakeData;
            if (data && typeof data.magnitude === 'number') {
              totalMagnitude += data.magnitude;
              validCount++;
            }
          });
          
          const avgMagnitude = validCount > 0 ? totalMagnitude / validCount : 0;
          const clusterColor = getMagnitudeColor(avgMagnitude);
          
          // Determine size based on count
          let size = 40;
          if (count >= 100) {
            size = 60;
          } else if (count >= 10) {
            size = 50;
          }
          
          return L.divIcon({
            html: `<div class="cluster-marker" style="
              width: ${size}px;
              height: ${size}px;
              background: ${clusterColor};
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              font-weight: 600;
              color: white;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(255, 255, 255, 0.2);
              font-size: ${count >= 100 ? '14px' : count >= 10 ? '13px' : '12px'};
            "><span>${count}</span></div>`,
            className: 'custom-cluster-icon',
            iconSize: L.point(size, size),
          });
        },
      });
      map.addLayer(clusterGroupRef.current);
    }

    // Clear existing markers
    clusterGroupRef.current.clearLayers();

    // Add new markers (including wrapped copies for infinite scroll)
    earthquakes.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const magnitude = feature.properties.mag ?? 0;
      const size = getMagnitudeRadius(magnitude) * 2;
      const color = getMagnitudeColor(magnitude);

      // Create markers at wrapped longitudes for seamless infinite scrolling
      const wrappedLongitudes = getWrappedLongitudes(lng);
      
      wrappedLongitudes.forEach((wrappedLng) => {
        const icon = L.divIcon({
          className: 'earthquake-marker-icon',
          html: `<div class="earthquake-dot" style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            opacity: 0.8;
            transition: all 0.2s ease;
          "></div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([lat, wrappedLng], { icon }) as L.Marker & { earthquakeData?: EarthquakeMarkerData };
        
        // Store magnitude data on marker for cluster icon calculation
        marker.earthquakeData = { magnitude };
        
        // Add tooltip
        marker.bindTooltip(`<span class="font-semibold">M ${magnitude.toFixed(1)}</span>`, {
          direction: 'top',
          offset: [0, -5],
          opacity: 0.9,
          className: 'earthquake-tooltip',
        });

        // Add popup with earthquake details
        const popupContent = renderToString(<EarthquakePopup feature={feature} />);
        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'earthquake-popup-container',
        });

        // Add hover effects
        marker.on('mouseover', function(this: L.Marker) {
          const el = this.getElement();
          if (el) {
            const dot = el.querySelector('.earthquake-dot') as HTMLElement;
            if (dot) {
              dot.style.transform = 'scale(1.3)';
              dot.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              dot.style.borderWidth = '2px';
              dot.style.opacity = '1';
            }
          }
        });

        marker.on('mouseout', function(this: L.Marker) {
          const el = this.getElement();
          if (el) {
            const dot = el.querySelector('.earthquake-dot') as HTMLElement;
            if (dot) {
              dot.style.transform = 'scale(1)';
              dot.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              dot.style.borderWidth = '1px';
              dot.style.opacity = '0.8';
            }
          }
        });

        clusterGroupRef.current!.addLayer(marker);
      });
    });

    return () => {
      // Cleanup on unmount
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }
    };
  }, [earthquakes, map]);

  return null;
}

export default function EarthquakeMap() {
  const [magnitude, setMagnitude] = useState<MagnitudeFilter>('2.5');
  const [period, setPeriod] = useState<TimePeriodFilter>('day');
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [count, setCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('--');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Track previous earthquake IDs to detect new ones
  const previousIdsRef = useRef<Set<string>>(new Set());

  // Update document class when theme changes
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.remove('light');
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const loadEarthquakes = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const data = await fetchEarthquakes(magnitude, period);
      
      // Detect new earthquakes
      const currentIds = new Set(data.features.map((f) => f.id));
      const newIds = new Set<string>();
      
      if (previousIdsRef.current.size > 0) {
        data.features.forEach((feature) => {
          if (!previousIdsRef.current.has(feature.id)) {
            newIds.add(feature.id);
          }
        });
        
        if (newIds.size > 0) {
          toast.success(`${newIds.size} new earthquake${newIds.size > 1 ? 's' : ''} detected!`, {
            duration: 3000,
          });
        }
      }
      
      previousIdsRef.current = currentIds;
      setEarthquakes(data.features);
      setCount(data.features.length);
      // Use cachedAt to show when data was actually fetched from USGS
      setLastUpdated(formatCacheTime(data.cachedAt));
      
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error('Failed to load earthquakes:', error);
      toast.error('Failed to load earthquake data. Please try again.', {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [magnitude, period, isInitialLoad]);

  // Initial load - data is cached server-side for 6 hours
  useEffect(() => {
    loadEarthquakes();
  }, [loadEarthquakes]);

  return (
    <div className={`w-full h-dvh relative ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f5]'}`}>
      {/* Map */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        maxBounds={INFINITE_HORIZONTAL_BOUNDS}
        maxBoundsViscosity={1.0}
        worldCopyJump={true}
        zoomControl={true}
        className="w-full h-full absolute inset-0 z-0"
      >
        <MapConfig />
        <TileLayer
          key={isDarkMode ? 'dark' : 'light'}
          attribution={CARTO_ATTRIBUTION}
          url={isDarkMode ? CARTO_DARK_TILES : CARTO_LIGHT_TILES}
          subdomains="abcd"
          maxZoom={19}
          noWrap={false}
        />
        
        {/* Clustered earthquake markers using native Leaflet */}
        <ClusteredMarkers earthquakes={earthquakes} />
      </MapContainer>

      {/* Filter Panel */}
      <FilterPanel
        magnitude={magnitude}
        period={period}
        onMagnitudeChange={setMagnitude}
        onPeriodChange={setPeriod}
        isDarkMode={isDarkMode}
      />

      {/* Stats Bar - next to hamburger menu */}
      <div className="glass-panel absolute top-2 left-[52px] sm:top-4 sm:left-[72px] z-[1000] rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-2 sm:py-3">
        <StatsBar
          count={count}
          lastUpdated={lastUpdated}
          isLoading={isLoading && !isInitialLoad}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Magnitude Legend - bottom left */}
      <div className="glass-panel absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-[1000] rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-2 sm:py-3 min-w-[140px] sm:min-w-[200px]">
        <MagnitudeLegend isDarkMode={isDarkMode} />
      </div>

      {/* Theme Toggle - top right */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[1000]">
        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      </div>

      {/* Loading Overlay (initial load only) */}
      <LoadingOverlay isVisible={isInitialLoad && isLoading} />
    </div>
  );
}
