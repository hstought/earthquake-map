'use client';

import { EarthquakeFeature, getMagnitudeColor, formatTime, formatDepth } from '@/lib/earthquakeService';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface EarthquakePopupProps {
  feature: EarthquakeFeature;
}

export default function EarthquakePopup({ feature }: EarthquakePopupProps) {
  const { properties, geometry } = feature;
  const [lng, lat, depth] = geometry.coordinates;
  const mag = properties.mag !== null ? properties.mag.toFixed(1) : 'N/A';
  const magColor = getMagnitudeColor(properties.mag);

  return (
    <div className="earthquake-popup min-w-[220px] pr-3">
      {/* Header with magnitude badge */}
      <div className="flex items-center gap-3 mb-3 pr-1">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-lg transition-transform hover:scale-110"
          style={{ backgroundColor: magColor }}
        >
          {mag}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm popup-title truncate">
            {properties.place || 'Unknown location'}
          </div>
          <div className="text-xs popup-subtitle">
            {formatTime(properties.time)}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <span className="popup-label">Depth:</span>
          <span className="popup-value ml-1">{formatDepth(depth)}</span>
        </div>
        <div>
          <span className="popup-label">Coords:</span>
          <span className="popup-value ml-1">
            {lat.toFixed(2)}°, {lng.toFixed(2)}°
          </span>
        </div>
      </div>

      {/* Tsunami warning */}
      {properties.tsunami === 1 && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-500/20 rounded-lg text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Tsunami warning issued</span>
        </div>
      )}

      {/* USGS link */}
      <a
        href={properties.url}
        target="_blank"
        rel="noopener noreferrer"
        className="popup-link flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-all duration-200 group"
      >
        <span>View on USGS</span>
        <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
