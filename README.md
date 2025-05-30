# HaulMate

**HaulMate** is a Progressive Web App (PWA) designed for RV owners and truck operators to track vehicle payload and manage trip details.

## Features

### 🚛 Payload Calculator
- Input truck class, curb weight, cargo, and trailer tongue weight
- Real-time GVWR calculation and status
- Visual weight distribution diagram

### 🗺 Trip Tracker
- Interactive map with start/end geocoding
- MPG and fuel cost estimation
- Trip history with analytics (MPG, cost trends)
- Export history as CSV/JSON
- Printable trip summaries (PDF-ready)

### 🚙 Vehicle Manager
- Save/edit/delete truck/RV profiles
- Auto-fill MPG values for trips
- Dark mode and responsive design

## Technologies
- HTML5, Tailwind CSS (CDN)
- JavaScript (Vanilla)
- Leaflet.js, OpenStreetMap
- Chart.js, localStorage

## License
MIT


### Current Features in v1.0.2
- Payload Calculator with GVWR input and overload warning
- Trip Tracker with basic distance/cost estimation
- Vehicle Manager (add/edit/delete/save to browser)
- Clean Tailwind-based UI for all views
- Fully client-side with no backend or login required


### New in v1.0.3
- Trip History log with sortable table
- Chart.js graphs for MPG and cost-per-mile trends
- Offline access support using Service Workers
- Support for PWA installation with manifest and icons


### New in v1.0.4
- Export all trip and vehicle data to PDF using the "📄 Export Summary" button
- AutoTable + jsPDF integration for rich formatting


### New in v1.0.5
- Leaflet-based interactive map for trip previews
- Visual route lines shown for start/end city pairs
- Auto-zoom to route after trip is submitted


### New in v1.0.6
- Real-time geocoding using Nominatim (OpenStreetMap)
- Accurate lat/lon lookup for any city
- Still 100% free and open-source — no key or signup required


### New in v1.0.7
- Trip planner map now shows a directional route line
- Visual markers for start and destination
- Arrowhead shows direction of travel


### New in v1.0.8
- 🧭 Multi-stop trip planning (add waypoints!)
- 🔁 Route replay by clicking trip history
- 🗺️ Saved trip coordinates stored in history


### New in v1.0.9
- 🖱️ Drag-and-drop waypoint reordering (Sortable.js)
- ✅ Waypoints are used in the updated order for route drawing


### New in v1.1.0
- 📤 Export trips as `.gpx` files
- 🧭 GPX compatible with GPS apps like Gaia, Garmin, OnX, etc.
- 🔘 Export button added to trip history rows
