import React, {useEffect} from "react";
import {useCurrentPlaylist} from "../hooks/useCurrentPlaylist";

export function MediaSession({nextTrackFunction, previousTrackFunction}) {
  const {currentTrack: track} = useCurrentPlaylist();
  useEffect(() => {
    if ("mediaSession" in navigator && track) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: track.title,
        artwork: [
          {src: track.thumbNail, sizes: "96x96", type: "image/png"},
          {src: track.thumbNail, sizes: "128x128", type: "image/png"},
          // More sizes, like 192x192, 256x256, 384x384, and 512x512
        ],
      });
    }
  }, [track]);

  useEffect(() => {
    if ("mediaSession" in navigator && nextTrackFunction) {
      navigator.mediaSession.setActionHandler("nexttrack", nextTrackFunction);
    }
  }, [nextTrackFunction]);

  useEffect(() => {
    if ("mediaSession" in navigator && previousTrackFunction) {
      navigator.mediaSession.setActionHandler(
        "previoustrack",
        previousTrackFunction
      );
    }
  }, [previousTrackFunction]);

  return <></>;
}
