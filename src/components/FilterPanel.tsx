'use client';

import { MagnitudeFilter, TimePeriodFilter } from '@/lib/earthquakeService';
import { Zap } from 'lucide-react';

interface FilterPanelProps {
  magnitude: MagnitudeFilter;
  period: TimePeriodFilter;
  onMagnitudeChange: (value: MagnitudeFilter) => void;
  onPeriodChange: (value: TimePeriodFilter) => void;
  children?: React.ReactNode;
}

export default function FilterPanel({
  magnitude,
  period,
  onMagnitudeChange,
  onPeriodChange,
  children,
}: FilterPanelProps) {
  return (
    <div className="glass-panel absolute top-4 left-4 z-[1000] rounded-2xl p-6 min-w-[300px]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-5 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center transition-transform hover:rotate-12 hover:scale-110 duration-300">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Earthquake Map</h1>
          <p className="text-xs text-gray-400">Live seismic activity</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Magnitude Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Magnitude
          </label>
          <select
            className="custom-select w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all duration-200 cursor-pointer hover:bg-white/10 hover:border-white/20"
            value={magnitude}
            onChange={(e) => onMagnitudeChange(e.target.value as MagnitudeFilter)}
          >
            <option value="all">All Earthquakes</option>
            <option value="1.0">M1.0+ Minor</option>
            <option value="2.5">M2.5+ Light</option>
            <option value="4.5">M4.5+ Moderate</option>
            <option value="significant">Significant Only</option>
          </select>
        </div>

        {/* Time Period Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Time Period
          </label>
          <select
            className="custom-select w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all duration-200 cursor-pointer hover:bg-white/10 hover:border-white/20"
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as TimePeriodFilter)}
          >
            <option value="hour">Past Hour</option>
            <option value="day">Past Day</option>
            <option value="week">Past 7 Days</option>
            <option value="month">Past 30 Days</option>
          </select>
        </div>
      </div>

      {/* Children (StatsBar, MagnitudeLegend) */}
      {children}
    </div>
  );
}
