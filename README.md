# Earthquake Map

A Next.js React application for visualizing and tracking real-time earthquake data from USGS.

## Features

- 🌍 **Real-time earthquake data** - Powered by USGS GeoJSON API
- 🗺️ **Interactive map** - Built with React Leaflet and CartoDB dark tiles
- ✨ **Pulse-in animations** - New earthquakes animate into view
- 🎨 **Magnitude color coding** - Visual scale from green (minor) to red (major)
- 🔄 **Auto-refresh** - Updates every 30 minutes
- 🎛️ **Filters** - Filter by magnitude and time period
- 🌊 **Tsunami warnings** - Highlighted when issued
- 📱 **Responsive design** - Glass-panel UI with smooth hover effects
- 🔔 **Toast notifications** - Alerts for new earthquakes via Sonner

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, Tailwind CSS
- **Map:** React Leaflet, Leaflet
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hstought/earthquake-map.git
cd earthquake-map
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Tailwind + custom styles + Leaflet overrides
│   ├── layout.tsx       # Root layout with Sonner Toaster
│   └── page.tsx         # Main page with dynamic map import
├── components/
│   ├── EarthquakeMap.tsx    # Main map component with React Leaflet
│   ├── EarthquakePopup.tsx  # Popup content for markers
│   ├── FilterPanel.tsx      # Glass panel with magnitude/time filters
│   ├── LoadingOverlay.tsx   # Loading spinner overlay
│   ├── MagnitudeLegend.tsx  # Color scale legend
│   └── StatsBar.tsx         # Earthquake count and last updated
└── lib/
    └── earthquakeService.ts # USGS API types and fetch utilities
```

## Data Source

Earthquake data is provided by the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/earthquakes/feed/).

## License

MIT
