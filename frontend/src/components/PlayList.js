import React, { useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { YoutubeSearcher } from './YoutubeSearcher';
import { MediaSession } from './MediaSession';

export function PlayList() {
    
    const [playList, setPlayList] = useState([]);
    const [currentTrack, setCurrentTrack] = useState()

    const [debugText, setDebugText] = useState()    

    function nextTrack() {
        if(!currentTrack) return;
        for (var i=0; i < playList.length; i++) {
            if(playList[i] === currentTrack) {
                var nextSongIndex = i+1;
                if(nextSongIndex === playList.length) {
                    nextSongIndex = 0;
                }
                setCurrentTrack(playList[nextSongIndex]);
            }
        }
    }
    function previousTrack() {
        if(!currentTrack) return;
        for (var i=0; i < playList.length; i++) {
            if(playList[i] === currentTrack) {
                var trackIndex = i-1;
                if(trackIndex < 0) {
                    trackIndex = playList.length - 1;
                }
                setCurrentTrack(playList[trackIndex]);   
            }
        }
    }

    function debug(x) {
        console.log(x)
        setDebugText(x);
    }

    function playTrack(track) {
        setDebugText("Song " + track.title);
        setCurrentTrack(track);
    }

    return(
        <div className="playlist">

            <YoutubeSearcher playList={playList} setPlayList={setPlayList}/>
            <h2>PlayList</h2>
            <h3>{debugText}</h3>
            <ol>
                {playList.map((track) =>  
                        <li>
                            <div>
                                {track.title}
                                <button onClick={() => playTrack(track)}>Play</button>
                            </div>
                        </li> 
                    )
                } 
            </ol> 
            <AudioPlayer track={currentTrack} />
            <MediaSession track={currentTrack} nextTrackFunction={nextTrack} previousTrackFunction={previousTrack} />
        </div>
    );
}

