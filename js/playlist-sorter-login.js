const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = "4c66a889b8ab44f9adac166cef78e3c9";
const REDIRECT_URI = "http://127.0.0.1:5500/playlist-sorter.html";
const SCOPES = ["playlist-read-private", "playlist-modify-private", "playlist-modify-public", "user-read-recently-played"];
const JOINED_SCOPES = SCOPES.join("%20");

const LOGIN_BUTTON = document.getElementById("spotify-login-button");
LOGIN_BUTTON.addEventListener("click", () => {
    window.location = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${JOINED_SCOPES}&response_type=token&show_dialog=true`;
});

