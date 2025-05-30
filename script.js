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
