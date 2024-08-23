import React, { useState, useEffect } from "react";
import hash from "./hash";
import LoginButton from "./components/LoginButton";
import RandomSong from "./components/RandomSong";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    let _token = hash.access_token;

    if (_token) {
      setToken(_token);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!token ? <LoginButton /> : <RandomSong token={token}/>}
      </header>
    </div>
  );
}

export default App;
