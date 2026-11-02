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

const pad = n => String(n).padStart(2, "0");
document.getElementById("c-days").textContent = days;
document.getElementById("c-hours").textContent = pad(hours);
document.getElementById("c-minutes").textContent = pad(minutes);
document.getElementById("c-seconds").textContent = pad(seconds);

// little clock in the top bar
document.getElementById("clock").textContent = now.toLocaleString("en-US", {
  weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
});
}

updateCounter();
setInterval(updateCounter, 1000); // re-run every 1000 ms, so it ticks every second


async function loadGif() {
	const response = await fetch("https://nekos.best/api/v2/wave");
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
document.getElementById("weather-temp").textContent = `${temp}°F`;
document.getElementById("weather-desc").textContent = words;
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

const tickers = ["NVDA", "GOOGL", "UNH", "SPCX", "MSFT", "AAPL","QS","LVMUY","XOM","TTWO","PTGX"]

async function loadStocks() {
	const results = [];

	for (const ticker of tickers) {
	  const response = await fetch (`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`);
	  const data = await response.json();
	  // Finnhub returns dp: null (or an error) for tickers it doesn't cover — skip those
	  if (typeof data.dp === "number") {
	    results.push({ticker: ticker, change: data.dp });
	  }
}
console.log(results);

results.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

// build LED ticker items, e.g. "NVDA ▲2.31%"
const track = document.getElementById("stocks");
track.replaceChildren();
const makeTick = r => {
  const span = document.createElement("span");
  const up = r.change >= 0;
  span.className = `tick ${up ? "up" : "down"}`;
  span.textContent = `${r.ticker} ${up ? "▲" : "▼"}${Math.abs(r.change).toFixed(2)}%`;
  return span;
};
// add the list twice so the scroll loops seamlessly
for (let copy = 0; copy < 2; copy++) {
  results.forEach(r => track.appendChild(makeTick(r)));
}
track.style.setProperty("--ticker-duration", `${results.length * 4}s`);
track.classList.add("scrolling");
}

loadStocks();

document.getElementById("spotify-login").addEventListener("click", async () => {
  try {
    await spotifyLogin();
    loadTracks();
  } catch (err) {
    console.error(err);
    document.getElementById("tracks").textContent = `Spotify login failed: ${err.message}`;
  }
});

async function loadTracks() {
  const token = await getAccessToken();
  const loginButton = document.getElementById("spotify-login");
  const list = document.getElementById("tracks");
  if (!token) {
    loginButton.style.display = ""; // not logged in yet
    return;
  }
  const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    list.textContent = `Spotify error: ${data.error?.message || response.status}`;
    return;
  }

  loginButton.style.display = "none";
  list.replaceChildren();
  for (const track of data.items) {
    const li = document.createElement("li");
    const artists = track.artists.map(a => a.name).join(", ");
    const song = document.createElement("span");
    song.className = "song";
    song.textContent = track.name;
    const artist = document.createElement("span");
    artist.className = "artist";
    artist.textContent = artists;
    li.append(song, artist);
    list.appendChild(li);
  }
}

loadTracks();
