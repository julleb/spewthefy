import React, {useState, useContext, createContext} from "react";

const CurrentPlaylistContext = createContext();

export function CurrentPlaylistProvider({children}) {
  const [currentPlaylist, setCurrentPlaylist] = useState();
  const [currentTrack, setCurrentTrack] = useState();

  function nextTrack() {
    if (!currentTrack) return;
    for (let i = 0; i < currentPlaylist.length; i++) {
      if (currentPlaylist[i] === currentTrack) {
        let nextSongIndex = i + 1;
        if (nextSongIndex === currentPlaylist.length) {
          nextSongIndex = 0;
        }
        setCurrentTrack(currentPlaylist[nextSongIndex]);
      }
    }
  }

  return (
    <CurrentPlaylistContext.Provider
      value={{
        currentPlaylist,
        setCurrentPlaylist,
        currentTrack,
        setCurrentTrack,
        nextTrack,
      }}
    >
      {children}
    </CurrentPlaylistContext.Provider>
  );
}

export function useCurrentPlaylist() {
  return useContext(CurrentPlaylistContext);
}
