# 🌍 Earthquake Map

A modern, real-time earthquake visualization application built with Next.js and React. Track seismic activity worldwide with an interactive map powered by USGS data, featuring intelligent clustering, dynamic theming, and responsive design.

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🗺️ Interactive Mapping
- **Smart Clustering** - Automatic grouping of nearby earthquakes using native Leaflet marker clustering
- **Color-Coded Clusters** - Cluster colors represent the average magnitude of contained earthquakes
- **Magnitude Tooltips** - Hover over individual markers to see precise magnitude values
- **Zoom-Based Display** - Clusters expand at higher zoom levels for detailed exploration
- **Boundary Control** - Vertical scroll limits with horizontal world wrapping enabled

### 🎨 Visual Design
- **Dark/Light Themes** - Toggle between dark and light map styles with adaptive UI
- **Glassmorphism UI** - Modern glass-panel design with backdrop blur effects
- **Magnitude Scale** - Color gradient from green (minor) to red (major earthquakes)
- **Responsive Layout** - Optimized for desktop and mobile devices
- **Smooth Animations** - Pulse-in effects for new earthquakes, hover transitions

### 🎛️ Data Management
- **Real-Time Updates** - Auto-refresh every 30 minutes with new earthquake detection
- **Advanced Filtering** - Collapsible hamburger menu with magnitude and time period controls
  - Magnitude: All, 1.0+, 2.5+, 4.5+, Significant
  - Time: Past Hour, Day, Week, Month
- **Live Statistics** - Earthquake count and last update timestamp
- **Toast Notifications** - Alerts when new earthquakes are detected
- **USGS Integration** - Direct feed from the USGS Earthquake Hazards Program

### 🔧 Technical Features
- **SSR Disabled for Maps** - Dynamic import of Leaflet components
- **Type Safety** - Comprehensive TypeScript interfaces for USGS GeoJSON API
- **Performance Optimized** - Chunked loading for large datasets
- **Error Handling** - Graceful fallbacks with user-friendly error messages

## 🚀 Tech Stack

### Core Framework
- **[Next.js 16.0.7](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19.2.1](https://react.dev/)** - UI library with latest features
- **[TypeScript 5.7.2](https://www.typescriptlang.org/)** - Type-safe development

### Mapping & Visualization
- **[React Leaflet 4.2.1](https://react-leaflet.js.org/)** - React components for Leaflet
- **[Leaflet 1.9.4](https://leafletjs.com/)** - Interactive map library
- **[Leaflet.markercluster 1.5.3](https://github.com/Leaflet/Leaflet.markercluster)** - Native marker clustering
- **[CartoDB Basemaps](https://carto.com/basemaps/)** - Dark and light tile layers

### UI & Styling
- **[Tailwind CSS 3.4.16](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React 0.460.0](https://lucide.dev/)** - Modern icon library
- **[Sonner 1.7.0](https://sonner.emilkowal.ski/)** - Toast notifications

### Development Tools
- **[ESLint 9.16.0](https://eslint.org/)** - Code linting
- **[PostCSS 8.4.49](https://postcss.org/)** - CSS transformations
- **[Autoprefixer 10.4.20](https://github.com/postcss/autoprefixer)** - CSS vendor prefixes

## 📦 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hstought/earthquake-map.git
cd earthquake-map
```

2. **Install dependencies**
```bash
npm install
```

### Development

**Start the development server with Turbopack:**
```bash
npm run dev
```

The application will be available at **[http://localhost:3000](http://localhost:3000)**

### Production

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

### Linting

**Run ESLint:**
```bash
npm run lint
```

## 📁 Project Structure

```
earthquake-map/
├── src/
│   ├── app/
│   │   ├── globals.css         # Global styles, Tailwind, Leaflet overrides
│   │   ├── layout.tsx          # Root layout with metadata & Toaster
│   │   └── page.tsx            # Home page with dynamic map import
│   │
│   ├── components/
│   │   ├── EarthquakeMap.tsx   # Main map component with clustering
│   │   ├── EarthquakePopup.tsx # Popup content for earthquake markers
│   │   ├── FilterPanel.tsx     # Collapsible hamburger filter menu
│   │   ├── LoadingOverlay.tsx  # Full-screen loading spinner
│   │   ├── MagnitudeLegend.tsx # Color scale legend (bottom-left)
│   │   ├── StatsBar.tsx        # Earthquake count & refresh time
│   │   ├── ThemeToggle.tsx     # Dark/light mode toggle button
│   │   └── index.ts            # Component exports
│   │
│   └── lib/
│       └── earthquakeService.ts # USGS API client, types, utilities
│
├── public/                      # Static assets
├── eslint.config.mjs           # ESLint configuration
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies & scripts
```

## 🗂️ Component Architecture

### EarthquakeMap
Main container managing state, data fetching, and layout. Includes:
- `ClusteredMarkers` - Native Leaflet marker clustering with average magnitude colors
- `MapConfig` - Zoom control positioning
- Theme state management
- Auto-refresh interval (30 minutes)

### FilterPanel
Collapsible hamburger menu (top-left) with:
- Magnitude filter dropdown
- Time period filter dropdown
- Glassmorphism styling
- Open/close animation

### StatsBar
Displays (positioned next to hamburger):
- Total earthquake count
- Last update timestamp
- Spinning refresh icon when loading

### MagnitudeLegend
Shows color scale (bottom-left):
- Gradient from green (1.0) to red (7.0+)
- Magnitude labels

### ThemeToggle
Sun/Moon icon button (top-right) for:
- Switching between dark/light themes
- Map tile layer changes
- UI color adaptations

### EarthquakePopup
Detailed information modal showing:
- Magnitude and location
- Timestamp and depth
- Tsunami warning status
- Significance and alert levels
- Link to USGS details

## 🌐 Data Source

Earthquake data is sourced from the **[USGS Earthquake Hazards Program](https://earthquake.usgs.gov/earthquakes/feed/)**.

**API Endpoints:**
- `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/{magnitude}_{period}.geojson`

**Available Filters:**
- **Magnitude:** all, 1.0+, 2.5+, 4.5+, significant
- **Period:** hour, day, week, month

**Data Format:** GeoJSON with comprehensive earthquake properties including magnitude, location, depth, tsunami status, and more.

## 🎨 Magnitude Color Scale

| Magnitude | Color | Classification |
|-----------|-------|----------------|
| < 2.0 | 🟢 Green (`#22c55e`) | Minor |
| 2.0 - 2.9 | 🟡 Lime (`#84cc16`) | Light |
| 3.0 - 3.9 | 🟡 Yellow (`#eab308`) | Moderate |
| 4.0 - 4.9 | 🟠 Orange (`#f97316`) | Strong |
| 5.0 - 5.9 | 🔴 Deep Orange (`#ef4444`) | Major |
| 6.0+ | 🔴 Red (`#dc2626`) | Great |

## 🔑 Key Features Explained

### Marker Clustering
Uses native `leaflet.markercluster` plugin instead of React wrappers for better React 19 compatibility. Clusters automatically form based on proximity, with:
- Dynamic sizing based on earthquake count
- Average magnitude determines cluster color
- Spiderfying on max zoom for clarity

### Boundary Management
- **Vertical:** Limited to ±85° latitude to prevent scrolling beyond map
- **Horizontal:** Unlimited with world copy jump enabled for seamless wrapping
- **Viscosity:** Smooth bounce-back when reaching boundaries

### Theme System
Managed via React state with full UI adaptation:
- CartoDB dark/light basemap switching
- Glass-panel color adjustments
- Icon and text color changes
- Smooth transitions between themes

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[USGS](https://earthquake.usgs.gov/)** - Real-time earthquake data
- **[CartoDB](https://carto.com/)** - Beautiful basemap tiles
- **[Leaflet](https://leafletjs.com/)** - Open-source mapping library
- **[Vercel](https://vercel.com/)** - Next.js framework and hosting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ using Next.js and React**
