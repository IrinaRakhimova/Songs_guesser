import React, { useState, useEffect } from 'react';
import Guess from './Guess';
import placeholderImage from '../question.png';

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
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

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
        console.log(token);
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

        setShowAnswer(false);
        setShowHint(false);

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
      body: JSON.stringify({ uris: [uri] })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          console.error("Device not found, retrying...");
          player.connect().then(success => {
            if (success) {
              playTrack(device_id, uri);
            }
          });
        } else {
          console.error("Error playing track:", response.statusText);
        }
      }
    })
    .catch(error => console.error("Error playing track:", error));
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setShowHint(false); 
  };

  const handleShowHint = () => {
    setShowHint(true);
    setShowAnswer(false);
  };

  if (!is_active) {
    return (
      <div className="spinner-border m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  } else {
    return (
      <div className='flex-container'>
        <div className="container-player">           
            <div className={`main-wrapper ${is_paused ? 'paused' : 'playing'}`}>          
                <img
                src={showAnswer ? current_track.album.images[0].url : placeholderImage}
                className="now-playing__cover"
                />
                <div className='flex-container'>
                    <div className="now-playing__side">
                    {showAnswer ? (
                        <>
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">
                            {current_track.artists.map((artist, index) => (
                            <span key={index}>
                                {artist.name}{index < current_track.artists.length - 1 ? ', ' : ''}
                            </span>
                            ))}
                        </div>
                        </>
                    ) : showHint ? (
                        <>
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">{current_track.artists[0].name.charAt(0)}...</div>
                        </>
                    ) : null}              
                    </div> 
                    <button className="btn-spotify" style={{ width: '120px' }} onClick={() => { player.togglePlay() }}>
                        {is_paused ? "PLAY" : "PAUSE"}
                    </button>           
                </div>
            </div>           
        </div>
        <Guess name={name} artist={artist} handleShowHint={handleShowHint} handleShowAnswer={handleShowAnswer} token={token} setShowAnswer={setShowAnswer}/>
      </div>
    );
  }
}

export default Player;