import React, { useState, useEffect } from "react";
import hash from "./hash";
import LoginButton from "./components/LoginButton";
import ChooseAlbum from "./components/ChooseAlbum";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css'; 

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
        {!token ? <LoginButton /> : <ChooseAlbum token={token}/>}
      </header>
    </div>
  );
}

export default App;
