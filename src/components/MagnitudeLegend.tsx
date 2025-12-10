'use client';

interface MagnitudeLegendProps {
  isDarkMode: boolean;
}

export default function MagnitudeLegend({ isDarkMode }: MagnitudeLegendProps) {
  return (
    <div className="group">
      <p className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Magnitude Scale</p>
      <div className="flex items-center gap-1">
        <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600 transition-all duration-300 group-hover:h-3 group-hover:shadow-lg group-hover:shadow-orange-500/20" />
      </div>
      <div className="flex justify-between mt-1">
        <span className={`text-[10px] transition-colors ${isDarkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-600 group-hover:text-gray-700'}`}>1.0</span>
        <span className={`text-[10px] transition-colors ${isDarkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-600 group-hover:text-gray-700'}`}>3.0</span>
        <span className={`text-[10px] transition-colors ${isDarkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-600 group-hover:text-gray-700'}`}>5.0</span>
        <span className={`text-[10px] transition-colors ${isDarkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-600 group-hover:text-gray-700'}`}>7.0+</span>
      </div>
    </div>
  );
}
