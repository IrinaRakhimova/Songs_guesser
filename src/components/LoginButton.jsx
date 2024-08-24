import React from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";

function LoginButton() {
  return (
    <div>
        <h1 className="header">WELCOME TO SONGS GUESSER!</h1>
        <a
        className="btn btn-success btn-lg mt-5"
        role="button"
        href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20"
        )}&response_type=token&show_dialog=true`}
        >
        Login to Spotify
        </a>
    </div>
  );
}

export default LoginButton;