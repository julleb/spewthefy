import React, { useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { YoutubeSearcher } from './YoutubeSearcher';

export function PlayList() {
    
    const [playList, setPlayList] = useState([]);
    const [currentPlayingUrl, setCurrentPlayingUrl] = useState()

    function playUrl(url) {
        setCurrentPlayingUrl(url);
    }


    return(
        <div className="playlist">
            <YoutubeSearcher playList={playList} setPlayList={setPlayList}/>
            <h2>PlayList</h2>
            <ol>
                {playList.map((listItem) =>  
                        <li>
                            <div>
                                {listItem.title}
                                <button onClick={() => playUrl(listItem.youtubeUrl)}>Play</button>
                            </div>
                        </li> 
                    )
                } 
            </ol> 
            <AudioPlayer youtubeUrl={currentPlayingUrl} />
        </div>
    );

    
}





