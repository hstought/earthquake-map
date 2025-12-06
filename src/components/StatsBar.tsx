'use client';

import { RefreshCw } from 'lucide-react';

interface StatsBarProps {
  count: number;
  lastUpdated: string;
  isLoading: boolean;
}

export default function StatsBar({ count, lastUpdated, isLoading }: StatsBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 group cursor-default">
        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 transition-transform duration-200 group-hover:scale-110">
          {count}
        </span>
        <span className="text-xs text-gray-400">earthquakes</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <RefreshCw
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            isLoading 
              ? 'animate-spin text-orange-500' 
              : 'text-gray-500 hover:text-gray-400'
          }`}
        />
        <span>{lastUpdated}</span>
      </div>
    </div>
  );
}
