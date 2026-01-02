'use client';

import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95
        ${
          isDarkMode
            ? 'bg-black/60 backdrop-blur-xl border border-white/10 text-white hover:bg-black/70'
            : 'bg-white/80 backdrop-blur-xl border border-black/10 text-gray-800 hover:bg-white/90 shadow-lg'
        }
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
    </button>
  );
}
