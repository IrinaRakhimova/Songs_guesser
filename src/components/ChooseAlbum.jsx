import { useState } from "react";
import Player from "./Player";
import Header from "./Header";

const ChooseAlbum = ({ token }) => {
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
        console.log(token);
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
        <div className="app_width">
            <Header />
            <p className="m-3">I want to guess a ...</p>
            <div> 
                <button 
                    type="button" 
                    className="btn btn-primary me-2" 
                    onClick={() => handleSearch('2OFfgjs6kj0eA6FNayhAAJ')}>Pop Song
                </button> 
                <button 
                    type="button" 
                    className="btn btn-primary me-2" 
                    onClick={() => handleSearch('61jNo7WKLOIQkahju8i0hw')}>Rock Song
                </button> 
                <button 
                    type="button" 
                    className="btn btn-primary me-2" 
                    onClick={() => handleSearch('7GjUYpEYbpQ6lMiGxLVCJQ')}>Rap Song
                </button> 
                <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => handleSearch('3PmV9kb73f3jsUxFLD8RIT')}>Russian Song
                </button> 
            </div>
            {randomSong && <Player uri={randomSong.uri} token={token} name={randomSong.name} artist={randomSong.artist}/>}
        </div>
    );
};

export default ChooseAlbum;