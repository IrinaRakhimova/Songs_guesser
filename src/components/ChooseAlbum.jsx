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
        .then(response => {
            if (!response.ok) {
                if (response.status === 403) {
                console.log(token);    
                throw new Error("Access forbidden. Check if the playlist is available or the token has the right scopes.");
                }
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Continue processing data
        })
        .catch(error => {
            console.error("Error fetching random track:", error.message);
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
            <Header />
            <p className="m-3">I want to guess a ...</p>
            <div className="mb-4"> 
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