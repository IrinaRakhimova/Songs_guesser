export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
export const clientId = "f10f5c3ad1f04b79993338e581e3c01a";
export const redirectUri = "http://localhost:3000/redirect";
export const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
    "streaming",
    "user-read-private",
    "user-read-email",
    "user-modify-playback-state",
    "app-remote-control",
];