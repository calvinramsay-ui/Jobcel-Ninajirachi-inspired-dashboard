// May 11, 2026 at 10pm Eastern. The "-04:00" is the time zone offset
// (Boston is 4 hours behind UTC in May), so this is exact no matter where you open it.
const lastDay = new Date("2026-05-11T22:00:00-04:00");

function updateCounter() {
  const now = new Date();
  const msElapsed = now - lastDay; // subtracting two dates gives you milliseconds

  // YOUR CHALLENGE: turn msElapsed into days, hours, minutes, seconds
 const days = Math.floor(msElapsed / (1000*60*60*24));
const hours = Math.floor(msElapsed / (1000*60*60)) %24;
const minutes = Math.floor(msElapsed / (1000*60)) %60;
const seconds = Math.floor(msElapsed / (1000)) %60;

document.getElementById("counter").textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

}

updateCounter();
setInterval(updateCounter, 1000); // re-run every 1000 ms, so it ticks every second


async function loadGif() {
	const response = await fetch("https://nekos.best/api/v2/wave", {credentials: "include"});
	const data = await response.json();
	console.log(data);
document.getElementById("gif").src = data.results[0].url;
document.getElementById("anime-name").textContent = data.results[0].anime_name;
}
loadGif();

async function loadWeather() {
	const response = await fetch ("https://api.open-meteo.com/v1/forecast?latitude=42.30&longitude=-71.06&current=temperature_2m,weather_code&temperature_unit=fahrenheit");
	const data = await response.json();
console.log(data);
const temp = Math.round(data.current.temperature_2m);
const words = weatherWords[data.current.weather_code] || "Unknown";
document.getElementById("weather").textContent = `${temp}°F, ${words}`;
}
const weatherWords = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Showers",
  81: "Showers",
  82: "Heavy showers",
  95: "Thunderstorm",

}

loadWeather();

async function loadStock() {
	const response = await fetch (`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${FINNHUB_KEY}`);
	const data = await response.json();
console.log(data);
const change = data.dp.toFixed(2);
document.getElementById("stocks").textContent = `AAPL: ${change}%`; 
}

loadStock();
