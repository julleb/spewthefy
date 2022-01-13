import "./App.css";
import {PlayList} from "./components/PlayList";
import {PlayLists} from "./components/PlayLists";
import React from "react";
import {Home} from "./components/Home";
import {Route, Routes} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="playlists" element={<PlayLists />} />
        <Route exact path={"playlist/:playlistName"} element={<PlayList />} />
      </Routes>
    </div>
  );
}

export default App;
