import ReactAudioPlayer from "react-audio-player";
import ServerApi from "./ServerApi";
import React from "react";
import {useCurrentPlaylist} from "../hooks/useCurrentPlaylist";

export function AudioPlayer() {
  const {currentTrack: track, nextTrack} = useCurrentPlaylist();
  if (!track) return null;

  const trackUrl = track.youtubeUrl;
  const backendUrl = ServerApi.getAudioUrl(trackUrl);

  return (
    <div>
      <ReactAudioPlayer
        src={backendUrl}
        autoPlay
        controls
        onEnded={nextTrack}
      />
    </div>
  );
}
