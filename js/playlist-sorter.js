const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = "4c66a889b8ab44f9adac166cef78e3c9";
const REDIRECT_URI = "http://127.0.0.1:5500/playlist-sorter.html";
const SCOPES = ["playlist-read-private", "playlist-modify-private", "playlist-modify-public", "user-read-recently-played"];
const JOINED_SCOPES = SCOPES.join("%20");

const LOGIN_BUTTON = document.getElementById("spotify-login-button");

const loadUserPlaylists = async (ACCESS_TOKEN) => {
    const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: 'GET',
        headers: {'Authorization' : 'Bearer ' + ACCESS_TOKEN}
    });

    const data = await result.json();
    return data;
}

if (!window.location.hash)
{
    LOGIN_BUTTON.addEventListener("click", () => {
        window.location = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${JOINED_SCOPES}&response_type=token&show_dialog=true`;
    });
}
else
{
    LOGIN_BUTTON.style.display = "None";

    let params = window.location.hash.substring(1).split("&");
    const ACCESS_TOKEN = params[0].split("=")[1];
    const TOKEN_TYPE = params[1].split("=")[1];
    const EXPIRES_IN = params[2].split("=")[1];

    console.log(loadUserPlaylists(ACCESS_TOKEN));

    /* Create buttons for each playlist asking which needs to be sorted*/
    /* Loop through each track one at a time and off the option to place it in another playlist*/
    /* Create checkbox that controls if the song is deleted after sorted*/
}

