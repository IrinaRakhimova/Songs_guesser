import { useState } from "react";
import Player from "./Player";

const RandomSong = ({ token }) => {
    const [randomSong, setRandomSong] = useState(null);
    
    function getRandomSongFromPlaylist(playlistId) {
        const url = `https://api.spotify.com/v1/playlists/${playlistId}`;
    
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const totalTracks = data.tracks.total;
            if (totalTracks > 0) {
                const randomOffset = Math.floor(Math.random() * totalTracks);
    
                const trackUrl = `${url}/tracks?offset=${randomOffset}&limit=1`;
    
                return fetch(trackUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.items && data.items.length > 0) {
                        const track = data.items[0].track;
                        return {
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            image: track.album.images[0].url,
                            uri: track.uri,
                        };
                    }
                    return null;
                });
            }
            return null;
        });
    }
  
    function searchRandomSong(playlistId) {
        getRandomSongFromPlaylist(playlistId)
        .then((randomTrack) => {
            if (randomTrack) {
                console.log("Random Track:", randomTrack);
                setRandomSong(randomTrack);
            } else {
                console.error("No track found.");
            }
        })
        .catch((error) => console.error("Error fetching random track:", error));
    }

    function handleSearch(playlistId) {
        searchRandomSong(playlistId);
    }
 
    return (
        <div>
            <h1>Guess the song</h1>
            <p>Choose the genre</p>
            <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => handleSearch('37i9dQZF1DXbYM3nMM0oPk')}>Pop
            </button> 
            <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => handleSearch('37i9dQZF1DX35DWKgAk2B5')}>Rock
            </button> 
            <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => handleSearch('37i9dQZF1DX76t638V6CA8')}>Rap
            </button> 
            <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => handleSearch('2ITDHAuMB7g3bSAjvTr1E2')}>Russian Songs
            </button> 
            {randomSong && <Player uri={randomSong.uri} token={token} name={randomSong.name} artist={randomSong.artist}/>}
        </div>
    );
};

export default RandomSong;