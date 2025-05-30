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