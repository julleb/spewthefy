import React, { useState } from 'react';
import { AudioPlayer } from './AudioPlayer';

export function PlayList() {
    
    const [youtubeUrl, setYoutubeUrl] = useState();
    const [playList, setPlayList] = useState([]);
    const [currentPlayingUrl, setCurrentPlayingUrl] = useState()

    function addToPlayList(youtubeUrl) {
        const playListItem = {youtubeUrl};
        //adderar direkt playListItem direkt till statet.
        setPlayList([...playList, playListItem]);
    }

    function playUrl(url) {
        setCurrentPlayingUrl(url);
    }


    return(
        <div className="playlist">
            <input type="text" name="youtube-url" onChange={(event) => setYoutubeUrl(event.target.value)}/><br/>
            <button onClick={() => addToPlayList(youtubeUrl)}>Add</button>

            <h2>PlayList</h2>
            <ol>
                {playList.map((listItem) =>  
                        <li>
                            <div>
                                {listItem.youtubeUrl}
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





