import "./App.css";
import {PlayList} from "./components/PlayList";
import {PlayLists} from "./components/PlayLists";
import React, {useState} from "react";

function App() {
  const [showPlayLists] = useState(true);
  const [currentPlayList, setCurrentPlayList] = useState();

  return (
    <div className="App">
      {showPlayLists && !currentPlayList ? (
        <PlayLists setCurrentPlayList={setCurrentPlayList} />
      ) : null}
      {currentPlayList ? <PlayList playListName={currentPlayList} /> : null}
    </div>
  );
}

export default App;
