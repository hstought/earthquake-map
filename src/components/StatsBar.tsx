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
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 group cursor-default">
        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 transition-transform duration-200 group-hover:scale-110">
          {count}
        </span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>earthquakes</span>
      </div>
      <div className={`flex items-center gap-1.5 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
        <RefreshCw
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            isLoading 
              ? 'animate-spin text-orange-500' 
              : isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-600 hover:text-gray-700'
          }`}
        />
        <span className="whitespace-nowrap">Updated: {lastUpdated}</span>
      </div>
    </div>
  );
}
