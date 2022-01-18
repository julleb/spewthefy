import React, {useState, useEffect} from "react";
import {AudioPlayer} from "./AudioPlayer";
import {YoutubeSearcher} from "./YoutubeSearcher";
import {MediaSession} from "./MediaSession";
import ServerApi from "./ServerApi";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faAirFreshener,
  faCoffee,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

export function PlayList() {
  const {playlistName} = useParams();
  const [playList, setPlayList] = useState();
  const [currentTrack, setCurrentTrack] = useState();
  const navigate = useNavigate();

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
    ServerApi.removeFromPlayList(playlistName, track.uuid).then((response) => {
      if (response.ok) {
        getPlayList();
      } else {
        if (response.status === 401) {
          navigate(`/`);
        } else {
          console.error("Failed to get playlistName " + playlistName);
        }
      }
    });
  }

  function getPlayList() {
    ServerApi.getPlayList(playlistName)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 401) {
            navigate(`/`);
          } else {
            console.error("Failed to get playlistName " + playlistName);
            setPlayList([]);
          }
        }
      })
      .then((data) => {
        setPlayList(data);
      });
  }

  return (
    <div className="playlist">
      <YoutubeSearcher
        playListName={playlistName}
        playList={playList}
        setPlayList={setPlayList}
      />
      <h2>PlayList: {playlistName}</h2>
      <div className="d-flex justify-content-center">
        <ul className="list-group">
          {playList?.map((track) => (
            <li
              key={track.uuid}
              onClick={() => playTrack(track)}
              className={`${
                currentTrack?.youtubeUrl === track.youtubeUrl ? "active" : ""
              } list-group-item list-group-item-action list-group-item-dark`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div>
                    <img
                      style={{width: 50}}
                      src={track.thumbNail}
                      alt="alternative?"
                    />
                  </div>
                  <div style={{marginLeft: 5}}>{track.title}</div>
                </div>
                <FontAwesomeIcon
                  style={{cursor: "pointer"}}
                  icon={faTrashAlt}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeTrack(track);
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer track={currentTrack} nextTrack={nextTrack} />
      <MediaSession
        track={currentTrack}
        nextTrackFunction={nextTrack}
        previousTrackFunction={previousTrack}
      />
    </div>
  );
}

function Footer({currentTrack, nextTrack}) {
  return (
    <footer
      className="bg-light text-center text-lg-start"
      style={{position: "fixed", bottom: 0, width: "100%", zIndex: 10}}
    >
      <div className="text-center p-3" style={{backgroundColor: "black"}}>
        <AudioPlayer track={currentTrack} nextTrack={nextTrack} />
      </div>
    </footer>
  );
}
