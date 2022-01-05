
import ReactAudioPlayer from 'react-audio-player';

export function AudioPlayer({track}) {
  
  var trackUrl = "";
  if(track) {
      trackUrl = track.youtubeUrl;
  }
  const backendUrl = "http://localhost:8081/audio?url=" + trackUrl;


    return (
      <div>
      <ReactAudioPlayer
        src={backendUrl}
        autoPlay
        controls
      />
      </div>
    );
  }


 