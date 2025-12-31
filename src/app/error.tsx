'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary UI for the home page
 * Displayed when an error occurs during rendering
 */
export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="w-full h-dvh bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
          <p className="text-sm text-gray-400">
            An error occurred while loading the earthquake map. Please try again.
          </p>
        </div>
        
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try again</span>
        </button>
        
        {error.digest && (
          <p className="text-xs text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
