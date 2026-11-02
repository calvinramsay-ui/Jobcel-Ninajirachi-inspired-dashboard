# Jobcel Ninajirachi-inspired dashboard

A Chrome new-tab page made with a pastel cyberpunk / outrun look, inspired by
Ninajirachi's *I Love My Computer*. Every new tab shows:

- **Jobless day counter**: days, hours, minutes and seconds since my last day of work, ticking live
- **Weather**: the current temperature and conditions in Boston, with an animated icon that matches the weather (sun, moon, clouds, rain, snow, storm, fog)
- **Anime gif**: a random waving gif from [nekos.best](https://nekos.best)
- **Top tracks**: my most-played Spotify songs from the last few weeks. Click a row to open the song; hover to tint the panel with the album's color
- **Bloomberg terminal**: a scrolling LED stock ticker from [Finnhub](https://finnhub.io)

## Setup

1. **Clone the repo**
   ```
   git clone https://github.com/calvinramsay-ui/Jobcel-Ninajirachi-inspired-dashboard.git
   ```

2. **Add your keys.** Copy `config.example.js` to `config.js`, then fill it in:
   - `FINNHUB_KEY`: a free key from [finnhub.io/register](https://finnhub.io/register)
   - `SPOTIFY_CLIENT_ID`: create an app at the [Spotify developer dashboard](https://developer.spotify.com/dashboard) and copy its Client ID

3. **Load it in Chrome**
   - Go to `chrome://extensions` and turn on **Developer mode** (top right)
   - Click **Load unpacked** and pick the project folder
   - Open a new tab

4. **Connect Spotify** (optional)
   - In `chrome://extensions`, copy the dashboard's extension ID
   - In your Spotify app's settings, add this redirect URI:
     `https://<your-extension-id>.chromiumapp.org/`
   - Back on the dashboard, click **▶ connect spotify**

The weather and gifs need no keys. To show weather for somewhere other than
Boston, change the `latitude` / `longitude` in `loadWeather()` in `app.js`
(and the "boston, ma" label in `newtab.html`).

## Built with

Plain HTML, CSS and JavaScript (no frameworks or build step) as a Manifest V3
Chrome extension. Data comes from [Open-Meteo](https://open-meteo.com), nekos.best,
Finnhub and the Spotify Web API. Fonts are Anton, Space Mono, DotGothic16 and
Silkscreen, all under the SIL Open Font License.
