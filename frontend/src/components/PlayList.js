import React, {useEffect} from "react";
import {YoutubeSearcher} from "./YoutubeSearcher";
import {MediaSession} from "./MediaSession";
import ServerApi from "./ServerApi";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {Footer} from "./Footer";
import {useCurrentPlaylist} from "../hooks/useCurrentPlaylist";

export function PlayList() {
  const {playlistName} = useParams();
  const {currentPlaylist: playList, setCurrentPlaylist: setPlayList} =
    useCurrentPlaylist();
  const {currentTrack, setCurrentTrack, nextTrack} = useCurrentPlaylist();
  const navigate = useNavigate();

  useEffect(() => {
    //init playList
    getPlayList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <YoutubeSearcher playListName={playlistName} playList={playList} />
      <h2>PlayList: {playlistName}</h2>
      <div className="d-flex justify-content-center">
        <ul className="list-group">
          {playList?.map((track) => (
            <li
              key={track.uuid}
              onClick={() => playTrack(track)}
              className={`${
                currentTrack?.uuid === track.uuid ? "active" : ""
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
      <MediaSession
        nextTrackFunction={nextTrack}
        previousTrackFunction={previousTrack}
      />
    </div>
  );
}
