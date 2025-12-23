# Earthquake Map

A real-time earthquake visualization app built with Next.js and React. Track seismic activity worldwide using USGS data with an interactive map, intelligent clustering, dark/light themes, and advanced filtering.

## Features

- **Interactive Map** - Smart marker clustering with magnitude-based coloring
- **Live Filtering** - Filter by magnitude and time period with a collapsible menu
- **Dark/Light Themes** - Toggle between dark and light map styles
- **Real-Time Updates** - Auto-refresh every 30 minutes with new earthquake detection
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Magnitude Scale** - Visual color gradient from green (minor) to red (major)

## Tech Stack

- **Next.js 16** - React framework with Turbopack
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Leaflet + React Leaflet** - Interactive mapping
- **USGS API** - Real-time earthquake data

## 📦 Getting Started

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
2. **Filter Data** - Users can filter by magnitude level (all, 1.0+, 2.5+, 4.5+, or significant only)
3. **Filter by Time** - Select data from the past hour, day, week, or month
4. **Cluster Markers** - Nearby earthquakes are automatically grouped for better performance
5. **View Details** - Click on markers to see detailed earthquake information including location, depth, and magnitude

## License

MIT
````
