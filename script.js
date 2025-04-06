let map = L.map("map", {
  center: [0, 0],
  zoom: 2,
  zoomControl: false,
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let currentMarker = null;

const ipInput = document.querySelector(".input-field");
const ipValue = ipInput.value.trim();

const searchButton = document.querySelector(".button");
const ipAddress = document.querySelector(".ip-address");
const location2 = document.querySelector(".location");
const utc = document.querySelector(".utc");
const isp = document.querySelector(".isp");

const URL = "https://geo.ipify.org/api/v2/country,city";
const API_KEY = "RC1Irf8bP8U862axQJzxkZlEGYLnS";
let debounceTimeout;
let ip2 = "8.8.8.8";

async function getIpAddress(ip) {
  try {
    ip2 = ip;
    const response = await fetch(
      `${URL}?apiKey=at_${API_KEY}&ipAddress=${ip2}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const { lat, lng, country, region, timezone, city } = data.location;

    if (!lat || !lng) {
      throw new Error("Latitude or longitude not found in API response");
    }

    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    // Add a new marker at the IP's location
    currentMarker = L.marker([lat, lng]).addTo(map);
    currentMarker
      .bindPopup(`<b>${country}</b><br>${city}, ${region}`)
      .openPopup();

    // Center the map on the new location
    map.setView([lat, lng], 10); // Zoom level 10 for a closer view

    ipAddress.textContent = data.ip;
    location2.textContent = `${country}, ${region}`;
    utc.textContent = `UTC ${timezone}`;
    isp.textContent = data.isp;
    console.log(data);
    console.log(lat);
  } catch (error) {
    console.error("API request failed:", error);
  }
}
getIpAddress(ip2);

searchButton.addEventListener("click", () => {
  console.log("Search button clicked");
  const ipAddress = ipInput.value.trim();
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

  if (!ipRegex.test(ipAddress)) {
    ipInput.value = "";
    ipInput.placeholder = "Please enter a valid IPv4 address (e.g., 8.8.8.8)";
    ipInput.classList.add("error");
    return;
  }

  // Clear any previous error state
  ipInput.classList.remove("error");
  ipInput.placeholder = "Search for any IP address or domain";

  if (!ipAddress) {
    console.error("Please enter an IP address");
    return;
  }
  getIpAddress(ipAddress);
});
