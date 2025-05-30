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
