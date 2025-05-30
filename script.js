// script.js — HaulMate Logic

// ----- Payload Calculator -----
document.getElementById("payloadForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const gvwr = parseFloat(form.gvwr.value) || 0;
  const curb = parseFloat(form.curbWeight.value) || 0;
  const cargo = parseFloat(form.cargoWeight.value) || 0;
  const tongue = parseFloat(form.tongueWeight.value) || 0;
  const remaining = gvwr - curb - cargo - tongue;

  document.getElementById("remainingPayload").textContent = remaining.toFixed(2);
  const status = document.getElementById("statusText");
  status.textContent = remaining < 0 ? "Overloaded ⚠️" : "Within Limits ✅";
  status.className = remaining < 0 ? "text-red-600" : "text-green-600";
  document.getElementById("payloadResult").classList.remove("hidden");
});

// ----- Trip Tracker -----
document.getElementById("tripForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const mpg = parseFloat(form.mpg.value) || 0;
  const fuelCost = parseFloat(form.fuelCost.value) || 0;

  // Mock distance = 300 miles
  const distance = 300;
  const gallons = distance / mpg;
  const cost = gallons * fuelCost;

  document.getElementById("tripDistance").textContent = distance.toFixed(0);
  document.getElementById("tripCost").textContent = cost.toFixed(2);
  document.getElementById("tripResult").classList.remove("hidden");
});

// ----- Vehicle Manager -----
let vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");

function saveVehicles() {
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
  renderVehicleList();
}

function renderVehicleList() {
  const table = document.getElementById("vehicleTableBody");
  table.innerHTML = "";
  vehicles.forEach((v, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-2 py-1">${v.name}</td>
      <td class="border px-2 py-1">${v.class}</td>
      <td class="border px-2 py-1">${v.mpgLoaded}</td>
      <td class="border px-2 py-1">${v.mpgUnloaded}</td>
      <td class="border px-2 py-1 text-right">
        <button onclick="editVehicle(${i})" class="text-blue-600">✏️</button>
        <button onclick="deleteVehicle(${i})" class="text-red-600 ml-2">🗑️</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function editVehicle(index) {
  const v = vehicles[index];
  const form = document.getElementById("vehicleForm");
  form.name.value = v.name;
  form.class.value = v.class;
  form.mpgLoaded.value = v.mpgLoaded;
  form.mpgUnloaded.value = v.mpgUnloaded;
  form.dataset.index = index;
}

function deleteVehicle(index) {
  vehicles.splice(index, 1);
  saveVehicles();
}

document.getElementById("vehicleForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const vehicle = {
    name: form.name.value.trim(),
    class: form.class.value.trim(),
    mpgLoaded: parseFloat(form.mpgLoaded.value),
    mpgUnloaded: parseFloat(form.mpgUnloaded.value),
  };
  const idx = form.dataset.index;
  if (idx) {
    vehicles[parseInt(idx)] = vehicle;
    delete form.dataset.index;
  } else {
    vehicles.push(vehicle);
  }
  form.reset();
  saveVehicles();
});

renderVehicleList();
console.log("HaulMate loaded");

// ----- Trip History Tracking -----
let tripHistory = JSON.parse(localStorage.getItem("tripHistory") || "[]");

function saveTrip(start, end, mpg, fuelCost, distance, cost) {
  const trip = {
    date: new Date().toISOString(),
    start, end, mpg, fuelCost, distance, cost
  };
  tripHistory.push(trip);
  localStorage.setItem("tripHistory", JSON.stringify(tripHistory));
  renderTripHistory();
}

function renderTripHistory() {
  const table = document.getElementById("tripHistoryTableBody");
  table.innerHTML = "";
  tripHistory.forEach(t => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(t.date).toLocaleString()}</td>
      <td>${t.start}</td>
      <td>${t.end}</td>
      <td>${t.distance} mi</td>
      <td>$${t.cost.toFixed(2)}</td>
    `;
    table.appendChild(row);
  });

  // Update chart
  if (window.tripChart) {
    window.tripChart.data.labels = tripHistory.map(t => new Date(t.date).toLocaleDateString());
    window.tripChart.data.datasets[0].data = tripHistory.map(t => t.mpg);
    window.tripChart.data.datasets[1].data = tripHistory.map(t => t.cost / t.distance);
    window.tripChart.update();
  }
}

// Hook trip tracker to save trip
document.getElementById("tripForm").addEventListener("submit", function (e) {
  // ... existing logic
  const start = e.target.start.value;
  const end = e.target.end.value;
  saveTrip(start, end, mpg, fuelCost, distance, cost);
});

// ----- Chart Initialization -----
document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("tripChart").getContext("2d");
  window.tripChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: "MPG",
          data: [],
          borderColor: "blue",
          fill: false
        },
        {
          label: "Cost per Mile",
          data: [],
          borderColor: "green",
          fill: false
        }
      ]
    }
  });
  renderTripHistory();
});


// ----- PDF Export Summary -----
async function exportSummaryPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("HaulMate Summary Report", 14, 20);

  doc.setFontSize(12);
  doc.text("Trip History", 14, 30);
  const tripRows = tripHistory.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.start, t.end,
    t.distance + " mi",
    "$" + t.cost.toFixed(2),
    t.mpg.toFixed(1),
    "$" + (t.cost / t.distance).toFixed(2)
  ]);
  doc.autoTable({
    startY: 35,
    head: [["Date", "Start", "End", "Distance", "Cost", "MPG", "Cost/mi"]],
    body: tripRows,
    theme: "grid",
    headStyles: { fillColor: [55, 78, 163] }
  });

  doc.addPage();
  doc.setFontSize(12);
  doc.text("Vehicle Profiles", 14, 20);
  const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
  const vehicleRows = vehicles.map(v => [v.name, v.class, v.mpgLoaded, v.mpgUnloaded]);
  doc.autoTable({
    startY: 25,
    head: [["Name", "Class", "MPG Loaded", "MPG Unloaded"]],
    body: vehicleRows,
    theme: "grid",
    headStyles: { fillColor: [55, 78, 163] }
  });

  doc.save("HaulMate_Summary.pdf");
}


// ----- Leaflet Trip Map Planner -----
let map, routeLayer;

function initTripMap() {
  map = L.map('tripMap').setView([39.5, -98.35], 4); // USA center
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  routeLayer = L.layerGroup().addTo(map);
}

function plotRoute(startCoords, endCoords) {
  routeLayer.clearLayers();
  const line = L.polyline([startCoords, endCoords], {
    color: "blue", weight: 4
  }).addTo(routeLayer);
  map.fitBounds(line.getBounds(), { padding: [50, 50] });
}

// Dummy geocoding lookup using simple lat/lon map (for demo purposes)
const dummyLocations = {
  "Denver": [39.7392, -104.9903],
  "Chicago": [41.8781, -87.6298],
  "Los Angeles": [34.0522, -118.2437],
  "Dallas": [32.7767, -96.7970],
  "Orlando": [28.5383, -81.3792],
  "Seattle": [47.6062, -122.3321]
};

function resolveCoordinates(cityName) {
  return dummyLocations[cityName] || [39.5, -98.35];
}

// Hook map into trip submission
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tripMap")) initTripMap();
});

document.getElementById("tripForm").addEventListener("submit", function (e) {
  const start = e.target.start.value;
  const end = e.target.end.value;
  const startCoords = resolveCoordinates(start);
  const endCoords = resolveCoordinates(end);
  plotRoute(startCoords, endCoords);
});


// ----- Real Geocoding with Nominatim -----
async function geocodeCity(cityName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: { "User-Agent": "HaulMateApp/1.0 (jrky.github.io)" }
  });
  const data = await response.json();
  if (data && data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } else {
    alert("Could not find location: " + cityName);
    return [39.5, -98.35]; // fallback to USA center
  }
}

document.getElementById("tripForm").addEventListener("submit", async function (e) {
  const start = e.target.start.value;
  const end = e.target.end.value;
  const startCoords = await geocodeCity(start);
  const endCoords = await geocodeCity(end);
  plotRoute(startCoords, endCoords);

  // Save trip (reuse logic from above)
  const mpg = parseFloat(e.target.mpg.value);
  const fuelCost = parseFloat(e.target.fuelCost.value);
  const distance = parseFloat(e.target.distance.value);
  const cost = (distance / mpg) * fuelCost;
  saveTrip(start, end, mpg, fuelCost, distance, cost);
});


function plotRoute(startCoords, endCoords) {
  routeLayer.clearLayers();
  const routeLine = L.polyline([startCoords, endCoords], {
    color: "blue",
    weight: 5,
    opacity: 0.8,
    dashArray: "8,6"
  }).addTo(routeLayer);

  // Add start and end markers
  const startMarker = L.marker(startCoords).bindPopup("Start").addTo(routeLayer);
  const endMarker = L.marker(endCoords).bindPopup("Destination").addTo(routeLayer);

  // Optional arrow head for direction
  const midPoint = [
    (startCoords[0] + endCoords[0]) / 2,
    (startCoords[1] + endCoords[1]) / 2
  ];
  const arrow = L.polylineDecorator(routeLine, {
    patterns: [
      { offset: "50%", repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 12, polygon: false, pathOptions: { stroke: true } }) }
    ]
  }).addTo(routeLayer);

  map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });
}


function addWaypointField() {
  const container = document.getElementById("waypoints");
  const input = document.createElement("input");
  input.type = "text";
  input.name = "waypoint";
  input.placeholder = "Enter city";
  input.className = "w-full border rounded px-2 py-1";
  container.appendChild(input);
}

// Geocode a list of city names
async function geocodeCities(cityList) {
  const coords = [];
  for (const city of cityList) {
    const coord = await geocodeCity(city);
    coords.push(coord);
  }
  return coords;
}

// Submit handler with full route geocoding
document.getElementById("tripForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const start = e.target.start.value;
  const end = e.target.end.value;
  const waypoints = Array.from(e.target.querySelectorAll("input[name='waypoint']")).map(w => w.value).filter(Boolean);
  const cityList = [start, ...waypoints, end];
  const coords = await geocodeCities(cityList);
  plotFullRoute(coords);

  // Save trip with coords
  const mpg = parseFloat(e.target.mpg.value);
  const fuelCost = parseFloat(e.target.fuelCost.value);
  const distance = parseFloat(e.target.distance.value);
  const cost = (distance / mpg) * fuelCost;
  tripHistory.push({ start, end, waypoints, coords, mpg, fuelCost, distance, cost, date: Date.now() });
  localStorage.setItem("tripHistory", JSON.stringify(tripHistory));
  renderTripHistory();
});

// Plot multiple segment route
function plotFullRoute(coords) {
  routeLayer.clearLayers();
  const line = L.polyline(coords, {
    color: "green", weight: 4, dashArray: "6,6"
  }).addTo(routeLayer);
  L.marker(coords[0]).bindPopup("Start").addTo(routeLayer);
  L.marker(coords[coords.length - 1]).bindPopup("End").addTo(routeLayer);
  map.fitBounds(line.getBounds(), { padding: [60, 60] });
}

// Replay trip route from history
window.replayRoute = function(index) {
  const trip = tripHistory[index];
  if (trip.coords && trip.coords.length > 1) {
    plotFullRoute(trip.coords);
  }
};

// Make trip history clickable
function renderTripHistory() {
  const tbody = document.getElementById("tripHistory");
  tbody.innerHTML = "";
  tripHistory.forEach((t, i) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-100 cursor-pointer";
    row.onclick = () => replayRoute(i);
    row.innerHTML = `
      <td class="p-2">${new Date(t.date).toLocaleDateString()}</td>
      <td class="p-2">${t.start} → ${t.end}</td>
      <td class="p-2">${t.distance} mi</td>
      <td class="p-2">$${t.cost.toFixed(2)}</td>
      <td class="p-2">${t.mpg.toFixed(1)}</td>
      <td class="p-2">$${(t.cost / t.distance).toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const wpContainer = document.getElementById("waypoints");
  if (wpContainer) {
    Sortable.create(wpContainer, {
      animation: 150,
      ghostClass: "bg-yellow-100"
    });
  }
});


function exportGPX(trip) {
  const waypoints = trip.coords.map((c, i) => `
    <trkpt lat="${c[0]}" lon="${c[1]}">
      <name>${i === 0 ? "Start" : (i === trip.coords.length - 1 ? "End" : "Waypoint " + i)}</name>
    </trkpt>`).join("");

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="HaulMate" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${trip.start} to ${trip.end}</name></metadata>
  <trk><name>${trip.start} to ${trip.end}</name><trkseg>${waypoints}
  </trkseg></trk>
</gpx>`;

  const blob = new Blob([gpx], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `haulmate_${trip.start.replace(/\s+/g, "_")}_to_${trip.end.replace(/\s+/g, "_")}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Add export button to trip rows
function renderTripHistory() {
  const tbody = document.getElementById("tripHistory");
  tbody.innerHTML = "";
  tripHistory.forEach((t, i) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-100";
    row.innerHTML = `
      <td class="p-2 cursor-pointer" onclick="replayRoute(${i})">${new Date(t.date).toLocaleDateString()}</td>
      <td class="p-2">${t.start} → ${t.end}</td>
      <td class="p-2">${t.distance} mi</td>
      <td class="p-2">$${t.cost.toFixed(2)}</td>
      <td class="p-2">${t.mpg.toFixed(1)}</td>
      <td class="p-2">$${(t.cost / t.distance).toFixed(2)}</td>
      <td class="p-2"><button onclick="exportGPX(tripHistory[${i}]); event.stopPropagation()" class="text-sm text-blue-600 hover:underline">Export GPX</button></td>
    `;
    tbody.appendChild(row);
  });
}
