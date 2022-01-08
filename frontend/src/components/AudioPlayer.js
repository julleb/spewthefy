
import ReactAudioPlayer from 'react-audio-player';
import ServerApi from './ServerApi'

export function AudioPlayer({track, nextTrack}) {
  
  var trackUrl = "";
  if(track) {
      trackUrl = track.youtubeUrl;
  }
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


 