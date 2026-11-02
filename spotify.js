// Makes a random string of letters and numbers
function randomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, v => chars[v % chars.length]).join("");
}

// Scrambles the secret into a "fingerprint" (the PKCE challenge)
async function makeChallenge(verifier) {
  const bytes = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Saves the tokens in the browser so you stay logged in
function saveTokens(tokens) {
  localStorage.setItem("spotify_access_token", tokens.access_token);
  localStorage.setItem("spotify_expires_at", Date.now() + tokens.expires_in * 1000);
  if (tokens.refresh_token) {
    localStorage.setItem("spotify_refresh_token", tokens.refresh_token);
  }
}

// Opens the Spotify popup, then trades the result for tokens
async function spotifyLogin() {
  const verifier = randomString(64);
  const challenge = await makeChallenge(verifier);
  const redirectUri = chrome.identity.getRedirectURL();

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: "user-top-read"
  });

  const resultUrl = await chrome.identity.launchWebAuthFlow({
    url: `https://accounts.spotify.com/authorize?${params}`,
    interactive: true
  });

  const result = new URL(resultUrl).searchParams;
  const code = result.get("code");
  if (!code) {
    throw new Error(result.get("error") || "no authorization code returned");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      code_verifier: verifier
    })
  });
  const tokens = await response.json();
  if (!response.ok) {
    throw new Error(tokens.error_description || tokens.error || "token exchange failed");
  }
  saveTokens(tokens);
}

// Returns a working token, quietly renewing it if it expired
async function getAccessToken() {
  const token = localStorage.getItem("spotify_access_token");
  const expiresAt = Number(localStorage.getItem("spotify_expires_at"));
  if (token && Date.now() < expiresAt - 60000) {
    return token;
  }

  const refreshToken = localStorage.getItem("spotify_refresh_token");
  if (!refreshToken) {
    return null;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID
    })
  });
  if (!response.ok) {
    return null;
  }
  const tokens = await response.json();
  saveTokens(tokens);
  return tokens.access_token;
}
