# Changelog

## v1.0.0 - Initial Release
- Full PWA shell and offline support
- Payload calculator with visual bars
- Trip tracker with live map and geocoding
- Trip history and export (CSV/JSON)
- Trip analytics via Chart.js
- Vehicle profile manager (add/edit/delete)
- Printable trip summary
- UI/UX polish with dark mode and responsive layout


## v1.0.2 - Full Feature Build
- Implemented Payload Calculator logic with remaining weight and overload alert
- Added basic Trip Tracker with mock 300-mile estimation and fuel cost calculation
- Full Vehicle Profile Manager with add/edit/delete and localStorage support
- Clean UI sections with Tailwind
- Prepared for future export features (PDF, charts)


## v1.0.3 - Trip Analytics & Offline Support
- Added trip history tracker with localStorage
- Chart.js visualizations for MPG and cost-per-mile
- Offline support via Service Worker
- Prepared PDF export functionality (to be finalized)


## v1.0.4 - PDF Export
- Added jsPDF + autoTable integration
- Export Trip History and Vehicle List to printable PDF
- Download summary report with one click


## v1.0.5 - Map-Based Trip Planner
- Integrated Leaflet.js for route mapping
- Displays preview route from start to destination city
- Uses basic lookup for major US cities (can be expanded)


## v1.0.6 - Real Geocoding
- Switched from dummy coordinates to live geocoding using Nominatim (OpenStreetMap)
- No API key required; fetches lat/lon dynamically based on entered city
- Gracefully handles location errors and shows alert if not found


## v1.0.7 - Route Direction Line
- Adds start/end markers for trip routes
- Route line includes directional arrow
- Auto-zooms to the full trip path


## v1.0.8 - Multi-Stop Routes + Replay
- Add any number of intermediate waypoints
- Full route plotted through all cities
- Trips now save coordinates
- Click trip history row to re-display route


## v1.0.9 - Reorderable Waypoints
- Waypoints can be reordered via drag-and-drop
- Built with Sortable.js (open source)
- Improves flexibility for trip route planning


## v1.1.0 - GPX Export Support
- Export any trip as a .gpx file for GPS apps
- Saves route with coordinates and waypoint labels
