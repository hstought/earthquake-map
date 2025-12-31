# Earthquake Map Documentation

This folder contains project documentation.

## Overview

Earthquake Map is a real-time earthquake visualization application powered by USGS data. It provides an interactive map interface to track seismic activity worldwide.

## Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints (cached USGS proxy)
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page with map
├── components/            # React components
│   ├── EarthquakeMap.tsx  # Main map component (client)
│   ├── EarthquakePopup.tsx # Popup for earthquake details
│   ├── FilterPanel.tsx    # Filter controls
│   └── ...
├── lib/                   # Utility functions and data access
│   ├── data/             # Data fetching functions
│   │   └── earthquakes.ts # Fetch earthquake data
│   └── earthquakeService.ts # Formatting utilities
└── types/                 # Shared TypeScript types
    └── earthquake.ts      # Domain types for earthquake data
```

### Data Flow

1. **API Route** (`/api/earthquakes`) - Proxies and caches USGS data
2. **Data Layer** (`lib/data/`) - Client-side data fetching functions
3. **Components** - Consume data via props, never fetch directly

### Key Technologies

- **Next.js 16** with App Router
- **React 19** with functional components
- **TypeScript** with strict mode
- **Tailwind CSS** for styling
- **Leaflet** for map visualization
- **pnpm** for package management

## Development

See the main [README.md](../README.md) for setup instructions.
