'use client';

export default function MagnitudeLegend() {
  return (
    <div className="mt-4 pt-4 border-t border-white/10 group">
      <p className="text-xs font-medium text-gray-400 mb-2">Magnitude Scale</p>
      <div className="flex items-center gap-1">
        <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600 transition-all duration-300 group-hover:h-3 group-hover:shadow-lg group-hover:shadow-orange-500/20" />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-500 transition-colors group-hover:text-gray-400">1.0</span>
        <span className="text-[10px] text-gray-500 transition-colors group-hover:text-gray-400">3.0</span>
        <span className="text-[10px] text-gray-500 transition-colors group-hover:text-gray-400">5.0</span>
        <span className="text-[10px] text-gray-500 transition-colors group-hover:text-gray-400">7.0+</span>
      </div>
    </div>
  );
}
