import React, { useState, useEffect } from 'react';
import ServerApi from './ServerApi'
import { v4 as uuidv4 } from 'uuid';

export function PlayLists({setCurrentPlayList}) {

    const [playLists, setPlayLists] = useState([]);
    const [createInput, setCreateInput] = useState();

    /*
    if(playLists.length === 0) {
        setPlayLists(['My First List', 'My Second List']);
    }*/


    useEffect (() => {
        //init playList
        getPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getPlaylists() {
        ServerApi.getPlayLists().then(response => {
            if(response.ok) {
                return response.json();
            }else {
                console.log("Failed to get playlists");
                setPlayLists([]);
            }
        }).then(data => {
            setPlayLists(data);
        });
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
                        <li key={uuidv4()}>
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