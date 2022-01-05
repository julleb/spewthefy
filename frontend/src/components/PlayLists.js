import React, { useState } from 'react';
import ServerApi from './ServerApi'
export function PlayLists({setCurrentPlayList}) {

    const [playLists, setPlayLists] = useState([]);
    const [createInput, setCreateInput] = useState();

    if(playLists.length === 0) {
        setPlayLists(['My First List', 'My Second List']);
    }
   
    async function createPlayList(playListName) {
        console.log("playList " + playListName);
         await ServerApi.createPlayList(playListName)
        .then(response => {
            if(response.ok) {
                setPlayLists([...playLists, playListName]);
            }else {
                console.log("Failed to create Playlist " + playListName);
            }
        });
    }

    return(
        <div className="playlists">
            <h2>Create PlayList</h2>
            <input type="text" onChange={(event) => setCreateInput(event.target.value)}/>
            <button onClick={() => createPlayList(createInput)}>Create</button>
            <ol>
                {playLists.map((playList) =>  
                        <li>
                            <div>
                                <button onClick={() => setCurrentPlayList(playList)}>{playList}</button>
                            </div>
                        </li> 
                    )
                } 
            </ol> 
        </div>
    );
}