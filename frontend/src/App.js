import "./App.css";
import {PlayList} from "./components/PlayList";
import {PlayLists} from "./components/PlayLists";
import React, {useState} from "react";
import {Home} from "./components/Home";
import {Route, Routes} from "react-router-dom";

function App() {
  const [showPlayLists] = useState(true);
  const [currentPlayList, setCurrentPlayList] = useState();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="playlists"
          element={<PlayLists setCurrentPlayList={setCurrentPlayList} />}
        />
      </Routes>
      {currentPlayList ? <PlayList playListName={currentPlayList} /> : null}
    </div>
  );
}

export default App;
