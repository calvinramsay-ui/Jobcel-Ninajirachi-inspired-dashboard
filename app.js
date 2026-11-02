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
	const response = await fetch ("https://api.open-meteo.com/v1/forecast?latitude=42.30&longitude=-71.06&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit");
	const data = await response.json();
console.log(data);
const code = data.current.weather_code;
const temp = Math.round(data.current.temperature_2m);
const words = weatherWords[code] || "Unknown";
document.getElementById("weather-temp").textContent = `${temp}°F`;
document.getElementById("weather-desc").textContent = words;
document.getElementById("weather-icon").innerHTML = weatherIcon(weatherKind(code), data.current.is_day === 1);
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
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm + hail",
  99: "Thunderstorm + hail",
}

// Groups Open-Meteo's many weather codes into the handful of icons we draw.
function weatherKind(code) {
  if (code <= 1) return "clear";
  if (code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 71 && code <= 77) return "snow";
  if (code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  if (code >= 51) return "rain"; // drizzle, rain, freezing rain, showers
  return "cloudy";
}

// Builds an animated SVG for the weather. All the motion lives in styles.css
// (look for the .wx- classes); this just picks which pieces to draw.
function weatherIcon(kind, isDay) {
  const sun = `
    <g class="wx-sun">
      <g class="wx-rays">
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(a =>
          `<line x1="32" y1="9" x2="32" y2="15" transform="rotate(${a} 32 32)"/>`).join("")}
      </g>
      <circle cx="32" cy="32" r="11"/>
    </g>`;
  const moon = `<path class="wx-moon" d="M38 14a18 18 0 1 0 12 30a14 14 0 0 1-12-30z"/>`;
  const cloud = (cls = "") =>
    `<path class="wx-cloud ${cls}" d="M20 50h26a9 9 0 0 0 0-18a13 13 0 0 0-25-3a10.5 10.5 0 0 0-1 21z"/>`;
  const drops = [22, 32, 42].map((x, i) =>
    `<line class="wx-drop" style="animation-delay:${i * 0.3}s" x1="${x}" y1="54" x2="${x - 2}" y2="60"/>`).join("");
  const flakes = [22, 32, 42].map((x, i) =>
    `<circle class="wx-flake" style="animation-delay:${i * 0.6}s" cx="${x}" cy="55" r="2"/>`).join("");
  const bolt = `<path class="wx-bolt" d="M34 44l-6 10h6l-3 9 9-12h-6l4-7z"/>`;
  const fog = [30, 38, 46, 54].map((y, i) =>
    `<line class="wx-fog" style="animation-delay:${i * 0.4}s" x1="12" y1="${y}" x2="52" y2="${y}"/>`).join("");
  const skyBody = isDay ? sun : moon;

  const parts = {
    clear:  skyBody,
    partly: `<g transform="translate(-8 -8) scale(0.8)">${skyBody}</g>${cloud("drift")}`,
    cloudy: `<g transform="translate(-10 -12) scale(0.7)">${cloud("drift slow faint")}</g>${cloud("drift")}`,
    rain:   `<g transform="translate(0 -8)">${cloud()}</g>${drops}`,
    snow:   `<g transform="translate(0 -8)">${cloud()}</g>${flakes}`,
    storm:  `<g transform="translate(0 -12)">${cloud("dark")}</g>${bolt}`,
    fog:    `<g transform="translate(0 -14)">${cloud("faint")}</g>${fog}`,
  };
  return `<svg viewBox="0 0 64 64" class="wx wx-${kind}">${parts[kind]}</svg>`;
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
  const panel = document.querySelector(".tracks-panel");

  for (const track of data.items) {
    const li = document.createElement("li");

    // the whole row is a link that opens the track in Spotify
    const link = document.createElement("a");
    link.className = "track-link";
    link.href = track.external_urls.spotify;
    link.target = "_blank";
    link.rel = "noopener";

    // album cover (Spotify lists sizes big → small; the last one is ~64px)
    const images = track.album.images;
    const art = document.createElement("img");
    art.className = "art";
    art.alt = "";
    art.crossOrigin = "anonymous"; // lets us read the pixels for the hover tint
    if (images.length) art.src = images[images.length - 1].url;

    const song = document.createElement("span");
    song.className = "song";
    song.textContent = track.name;
    const artist = document.createElement("span");
    artist.className = "artist";
    artist.textContent = track.artists.map(a => a.name).join(", ");
    const open = document.createElement("span");
    open.className = "open";
    open.textContent = "open ↗";

    link.append(art, song, artist, open);
    li.appendChild(link);
    list.appendChild(li);

    // hovering (or tabbing to) a row tints the panel with that album's color
    art.addEventListener("load", () => { link.dataset.tint = albumColor(art); }, { once: true });
    const tint = () => link.dataset.tint && panel.style.setProperty("--tint", link.dataset.tint);
    const untint = () => panel.style.removeProperty("--tint");
    link.addEventListener("mouseenter", tint);
    link.addEventListener("focus", tint);
    link.addEventListener("mouseleave", untint);
    link.addEventListener("blur", untint);
  }
}

// Picks the most vivid color from an album cover by shrinking it to 10×10
// and choosing the pixel with the best mix of saturation and brightness.
// Returns "" for colorless covers so the panel stays as-is.
function albumColor(img) {
  try {
    const size = 10;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, size, size);
    const px = ctx.getImageData(0, 0, size, size).data;

    let best = null, bestScore = -1, bestSat = 0;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], b = px[i + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      const score = saturation * 0.7 + (max / 255) * 0.3;
      if (score > bestScore) { bestScore = score; bestSat = saturation; best = [r, g, b]; }
    }
    // black & white / grey covers have no real color — keep the default look
    if (bestSat < 0.25) return "";
    return `rgb(${best.join(", ")})`;
  } catch (err) {
    return ""; // image couldn't be read; just skip the tint
  }
}

loadTracks();
