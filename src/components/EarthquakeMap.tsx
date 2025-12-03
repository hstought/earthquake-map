'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { toast } from 'sonner';
import L from 'leaflet';

import {
  fetchEarthquakes,
  getMagnitudeColor,
  getMagnitudeRadius,
  formatRelativeTime,
  type MagnitudeFilter,
  type TimePeriodFilter,
  type EarthquakeFeature,
} from '@/lib/earthquakeService';

import FilterPanel from './FilterPanel';
import StatsBar from './StatsBar';
import MagnitudeLegend from './MagnitudeLegend';
import LoadingOverlay from './LoadingOverlay';
import EarthquakePopup from './EarthquakePopup';

// Fix Leaflet default icon paths for bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-expect-error - Leaflet typing issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

// Constants
const AUTO_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
const CARTO_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTO_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Map configuration component for setting zoom control position
function MapConfig() {
  const map = useMap();
  
  useEffect(() => {
    map.zoomControl.setPosition('bottomright');
  }, [map]);
  
  return null;
}

// Individual earthquake marker component with hover effects
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
      <Popup maxWidth={300} className="earthquake-popup-container">
        <EarthquakePopup feature={feature} />
      </Popup>
    </CircleMarker>
  );
}

export default function EarthquakeMap() {
  const [magnitude, setMagnitude] = useState<MagnitudeFilter>('2.5');
  const [period, setPeriod] = useState<TimePeriodFilter>('day');
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [count, setCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('--');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Track previous earthquake IDs to detect new ones
  const previousIdsRef = useRef<Set<string>>(new Set());
  const [newEarthquakeIds, setNewEarthquakeIds] = useState<Set<string>>(new Set());

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
      setNewEarthquakeIds(newIds);
      setEarthquakes(data.features);
      setCount(data.features.length);
      setLastUpdated(formatRelativeTime(data.metadata.generated));
      
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

  // Initial load and auto-refresh
  useEffect(() => {
    loadEarthquakes();
    
    const intervalId = setInterval(loadEarthquakes, AUTO_REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [loadEarthquakes]);

  return (
    <div className="w-full h-dvh relative">
      {/* Map */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        worldCopyJump={true}
        zoomControl={true}
        className="w-full h-full z-0"
      >
        <MapConfig />
        <TileLayer
          attribution={CARTO_ATTRIBUTION}
          url={CARTO_DARK_TILES}
          subdomains="abcd"
          maxZoom={19}
        />
        
        {/* Earthquake markers */}
        {earthquakes.map((feature) => (
          <EarthquakeMarker
            key={feature.id}
            feature={feature}
            isNew={newEarthquakeIds.has(feature.id)}
          />
        ))}
      </MapContainer>

      {/* Filter Panel */}
      <FilterPanel
        magnitude={magnitude}
        period={period}
        onMagnitudeChange={setMagnitude}
        onPeriodChange={setPeriod}
      >
        <StatsBar
          count={count}
          lastUpdated={lastUpdated}
          isLoading={isLoading && !isInitialLoad}
        />
        <MagnitudeLegend />
      </FilterPanel>

      {/* Loading Overlay (initial load only) */}
      <LoadingOverlay isVisible={isInitialLoad && isLoading} />
    </div>
  );
}
