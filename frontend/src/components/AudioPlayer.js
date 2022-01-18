import ReactAudioPlayer from "react-audio-player";
import ServerApi from "./ServerApi";
import React from "react";

export function AudioPlayer({track, nextTrack}) {
  if (!track) return <div></div>;

  let trackUrl = track.youtubeUrl;
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
