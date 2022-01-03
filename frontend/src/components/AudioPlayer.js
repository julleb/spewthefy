
import ReactAudioPlayer from 'react-audio-player';

export function AudioPlayer({youtubeUrl}) {
  
  const backendUrl = "http://localhost:8081/audio?url=" + youtubeUrl;

    return (
      <ReactAudioPlayer
        src={backendUrl}
        autoPlay
        controls
      />
    );
  }


 