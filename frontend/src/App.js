import logo from './logo.svg';
import './App.css';

function App() {
  return (
    
    <div className="App">
      <AudioPlayer/>
    </div>
  );
}


function AudioPlayer() {
  return (
    <div className="audioPlayer">
       <audio controls>
        <source src="" type="audio/mpeg"/>
        Your browser does not support the audio element.
        </audio> 
    </div>
  );
}

export default App;
