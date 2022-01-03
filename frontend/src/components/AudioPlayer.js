
export function AudioPlayer({youtubeUrl}) {
  
  const backendUrl = "http://localhost:8081/audio?url=" + youtubeUrl;

    return (
      <div className="audioPlayer">
         <audio controls>
          <source src={backendUrl} type="audio/mpeg" autoPlay/>
          Your browser does not support the audio element.
          </audio> 
      </div>
    );
  }


 