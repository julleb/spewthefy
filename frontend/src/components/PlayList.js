import React, {useState, useEffect} from "react";
import {AudioPlayer} from "./AudioPlayer";
import {YoutubeSearcher} from "./YoutubeSearcher";
import {MediaSession} from "./MediaSession";
import ServerApi from "./ServerApi";

export function PlayList({playListName}) {
  const [playList, setPlayList] = useState();
  const [currentTrack, setCurrentTrack] = useState();

  useEffect(() => {
    //init playList
    getPlayList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function nextTrack() {
    if (!currentTrack) return;
    for (let i = 0; i < playList.length; i++) {
      if (playList[i] === currentTrack) {
        let nextSongIndex = i + 1;
        if (nextSongIndex === playList.length) {
          nextSongIndex = 0;
        }
        setCurrentTrack(playList[nextSongIndex]);
      }
    }
  }
  function previousTrack() {
    if (!currentTrack) return;
    for (let i = 0; i < playList.length; i++) {
      if (playList[i] === currentTrack) {
        let trackIndex = i - 1;
        if (trackIndex < 0) {
          trackIndex = playList.length - 1;
        }
        setCurrentTrack(playList[trackIndex]);
      }
    }
  }

  function playTrack(track) {
    setCurrentTrack(track);
  }

  function removeTrack(track) {
    ServerApi.removeFromPlayList(playListName, track.uuid).then((response) => {
      if (response.ok) {
        getPlayList();
      } else {
        console.error("Failed to get playlistName " + playListName);
      }
    });
  }

  function getPlayList() {
    ServerApi.getPlayList(playListName)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to get playlistName " + playListName);
          setPlayList([]);
        }
      })
      .then((data) => {
        setPlayList(data);
      });
  }

  return (
    <div className="playlist">
      <YoutubeSearcher
        playListName={playListName}
        playList={playList}
        setPlayList={setPlayList}
      />
      <h2>PlayList: {playListName}</h2>

      <div className="d-flex justify-content-center">
        <ul className="list-group">
          {playList?.map((track) => (
            <li
              key={track.uuid}
              onClick={() => playTrack(track)}
              className={`${
                currentTrack?.youtubeUrl === track.youtubeUrl ? "active" : ""
              } list-group-item`}
            >
              {track.title}
              <div className="d-flex justify-content-end">
                <button
                  className="btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeTrack(track);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <AudioPlayer track={currentTrack} nextTrack={nextTrack} />
      <MediaSession
        track={currentTrack}
        nextTrackFunction={nextTrack}
        previousTrackFunction={previousTrack}
      />
    </div>
  );
}
