'use client';

import { RefreshCw } from 'lucide-react';

interface StatsBarProps {
  count: number;
  lastUpdated: string;
  isLoading: boolean;
  isDarkMode: boolean;
}

export default function StatsBar({ count, lastUpdated, isLoading, isDarkMode }: StatsBarProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-1.5 sm:gap-2 group cursor-default">
        <span className="inline-flex items-center justify-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-orange-500/20 text-orange-400 transition-transform duration-200 group-hover:scale-110">
          {count}
        </span>
        <span className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
          <span className="hidden xs:inline">earthquakes</span>
          <span className="xs:hidden">quakes</span>
        </span>
      </div>
      <div className={`flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
        <RefreshCw
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${
            isLoading 
              ? 'animate-spin text-orange-500' 
              : isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-600 hover:text-gray-700'
          }`}
        />
        <span className="whitespace-nowrap">
          <span className="hidden sm:inline">Updated: </span>
          {lastUpdated}
        </span>
      </div>
    </div>
  );
}
