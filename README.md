# Earthquake Map

A real-time earthquake visualization app built with Next.js and React. Track seismic activity worldwide using USGS data with an interactive map, intelligent clustering, dark/light themes, and advanced filtering.

## Demo
https://earthquake-map-alpha.vercel.app/

## Features

- **Interactive Map** - Smart marker clustering with magnitude-based coloring
- **Live Filtering** - Filter by magnitude and time period with a collapsible menu
- **Dark/Light Themes** - Toggle between dark and light map styles
- **Edge Caching** - API responses cached for 10 minutes to reduce external API calls
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Magnitude Scale** - Visual color gradient from green (minor) to red (major)

## Tech Stack

- **Next.js 16** - React framework with Turbopack
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 3** - Utility-first styling
- **Leaflet + React Leaflet** - Interactive mapping
- **Biome** - Linting and formatting
- **USGS API** - Real-time earthquake data

## Getting Started

### Prerequisites
- Node.js v18 or higher

### Installation

1. Clone the repository
```bash
git clone https://github.com/hstought/earthquake-map.git
cd earthquake-map
```

2. Install dependencies
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production

Build for production:
```bash
npm run build
npm start
```

## How It Works

1. **Fetch Data** - App retrieves earthquake data from the USGS Earthquake Hazards Program API
2. **Edge Caching** - API responses are cached at Vercel's edge for 10 minutes to prevent excessive upstream calls
3. **Filter Data** - Users can filter by magnitude level (all, 1.0+, 2.5+, 4.5+, or significant only)
4. **Filter by Time** - Select data from the past hour, day, week, or month
5. **Cluster Markers** - Nearby earthquakes are automatically grouped for better performance
6. **View Details** - Click on markers to see detailed earthquake information including location, depth, and magnitude

## Architecture

The project groups code by feature and separates concerns between UI, data access, and types. Key folders:

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints (edge-cached USGS proxy)
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

- **Next.js 16** with App Router and built-in fetch caching
- **React 19** with functional components
- **TypeScript** with strict mode
- **Tailwind CSS 3** for styling
- **Leaflet** for map visualization
- **Biome** for linting and formatting
- **pnpm** for package management