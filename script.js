// script.js

// Payload Calculator UI
const payloadHTML = `
<section class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6 space-y-6">
  <h2 class="text-xl font-bold text-blue-800 dark:text-white">Payload Calculator</h2>
  <form id="payloadForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div><label class="block text-sm">GVWR (lbs)</label><input type="number" name="gvwr" class="block w-full border p-1 rounded" /></div>
    <div><label class="block text-sm">Curb Weight (lbs)</label><input type="number" name="curbWeight" class="block w-full border p-1 rounded" /></div>
    <div><label class="block text-sm">Cargo (lbs)</label><input type="number" name="cargoWeight" class="block w-full border p-1 rounded" /></div>
    <div><label class="block text-sm">Tongue Weight (lbs)</label><input type="number" name="tongueWeight" class="block w-full border p-1 rounded" /></div>
    <div class="md:col-span-2"><button type="submit" class="mt-2 px-4 py-2 bg-blue-700 text-white rounded">Calculate</button></div>
  </form>
  <div id="payloadResult" class="hidden mt-4 p-4 bg-blue-50 rounded border"><p>Remaining Payload: <span id="remainingPayload" class="font-bold"></span> lbs</p><p>Status: <span id="statusText"></span></p></div>
</section>`;

// Trip Tracker UI (simplified)
const tripHTML = `
<section class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-10 space-y-6">
  <h2 class="text-xl font-bold text-green-700 dark:text-white">Trip Tracker</h2>
  <form id="tripForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div><label class="block text-sm">Start Location</label><input type="text" name="start" class="block w-full border p-1 rounded" /></div>
    <div><label class="block text-sm">Destination</label><input type="text" name="end" class="block w-full border p-1 rounded" /></div>
    <div><label class="block text-sm">MPG</label><input type="number" name="mpg" class="block w-full border p-1 rounded" /></div>
    <div><label class="block text-sm">Fuel Cost</label><input type="number" name="fuelCost" class="block w-full border p-1 rounded" /></div>
    <div class="md:col-span-2"><button type="submit" class="mt-2 px-4 py-2 bg-green-600 text-white rounded">Estimate</button></div>
  </form>
  <div id="tripResult" class="hidden mt-4 p-4 bg-green-50 rounded border"><p><span id="tripDistance"></span> miles</p><p>$<span id="tripCost"></span> cost</p></div>
</section>`;

// Vehicle Manager UI (simplified)
const vehicleHTML = `
<section class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-10 space-y-6">
  <h2 class="text-xl font-bold text-blue-700 dark:text-white">Vehicle Profile Manager</h2>
  <form id="vehicleForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div><label class="block text-sm">Name</label><input type="text" name="name" class="block w-full border p-1 rounded" /></div>
    <div><label class="block text-sm">Class</label><input type="text" name="class" class="block w-full border p-1 rounded" /></div>
    <div><label class="block text-sm">MPG Loaded</label><input type="number" name="mpgLoaded" class="block w-full border p-1 rounded" /></div>
    <div><label class="block text-sm">MPG Unloaded</label><input type="number" name="mpgUnloaded" class="block w-full border p-1 rounded" /></div>
    <div class="md:col-span-2"><button type="submit" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Save Vehicle</button></div>
  </form>
</section>`;

document.getElementById('payloadSection').innerHTML = payloadHTML;
document.getElementById('tripSection').innerHTML = tripHTML;
document.getElementById('vehicleSection').innerHTML = vehicleHTML;

console.log("HaulMate loaded");