import React, { useState, useEffect } from 'react';
import Guess from './Guess';

function Player({ token, uri, name, artist }) {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState(undefined);
  const [current_track, setTrack] = useState({
    name: "",
    album: { images: [{ url: "" }] },
    artists: [{ name: "" }]
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);

        playTrack(device_id, uri);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state => {
        if (!state) return;

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then(state => {
          setActive(!!state);
        });
      }));

      player.connect().then(success => {
        if (success) {
          console.log('Player connected successfully');
        } else {
          console.error('Failed to connect player');
        }
      });
    };
  }, [token]);

  useEffect(() => {
    if (deviceId) {
      playTrack(deviceId, uri);
    }
  }, [uri, deviceId]);

  const playTrack = (device_id, uri) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        uris: [uri]
      })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          console.error("Device not found, retrying...");
          // Retry logic: attempt to reconnect or refresh the device
          player.connect().then(success => {
            if (success) {
              playTrack(device_id, uri); // Retry playing the track
            }
          });
        } else {
          console.error("Error playing track:", response.statusText);
        }
      }
    })
    .catch(error => console.error("Error playing track:", error));
  };

  if (!is_active) {
    return (
      <div className="container">
        <div className="main-wrapper">
          <b>Wait for it...</b>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="main-wrapper">
          <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
          <div className="now-playing__side">
            <div className="now-playing__name">{current_track.name}</div>
            <div className="now-playing__artist">{current_track.artists[0].name}</div>
            <button className="btn-spotify" onClick={() => { player.togglePlay() }}>{is_paused ? "PLAY" : "PAUSE"}</button>
            <Guess name={name} artist={artist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Player;