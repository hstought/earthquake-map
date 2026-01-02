/**
 * Loading UI for the home page
 * Displayed while the page is loading (e.g., during navigation)
 */
export default function Loading() {
  return (
    <main className="w-full h-dvh bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </main>
  );
}
