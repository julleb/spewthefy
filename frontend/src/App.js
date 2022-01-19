import "./App.css";
import {PlayList} from "./components/PlayList";
import {PlayLists} from "./components/PlayLists";
import React from "react";
import {Home} from "./components/Home";
import {Route, Routes} from "react-router-dom";
import {CurrentPlaylistProvider} from "./hooks/useCurrentPlaylist";
import {Footer} from "./components/Footer";

function App() {
  return (
    <div className="App">
      <CurrentPlaylistProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="playlists" element={<PlayLists />} />
          <Route exact path={"playlist/:playlistName"} element={<PlayList />} />
        </Routes>
        <Footer />
      </CurrentPlaylistProvider>
    </div>
  );
}

export default App;
