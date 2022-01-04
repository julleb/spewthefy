import YoutubeSearch from 'youtube-api-search'
import React, { useState } from 'react';

export function YoutubeSearcher() {
    const API_KEY = "";
    const youtubeThumbNailUrlBase = "https://img.youtube.com/vi/"
    const [videos, setVideos] = useState([]);

    function searchYoutubeVideo(searchText) {
        YoutubeSearch({key: API_KEY, term: searchText}, videos => {
            for (var i=0; i < videos.length; i++) {
                const videoId = videos[i].id.videoId;
                videos[i].snippet.thumbnailUrl = youtubeThumbNailUrlBase + videoId + "/3.jpg";
            } 
            setVideos(videos);
        });
    }

    return (
        <div>
            <input type="text" name="youtube-text" onChange={(event) => searchYoutubeVideo(event.target.value)}/><br/>
            <div>
                <h2>Search Result</h2>
                <ol>
                    {videos.map((video) =>  
                            <li>
                                <div>
                                   <img src={video.snippet.thumbnailUrl} alt="alternative?"></img>
                                   {video.id.videoId} {video.snippet.title}
                                   <button onClick={() => console.log("hej")}>Add</button>
                                </div>
                            </li> 
                        )
                    } 
                </ol> 
            </div>
        </div>
    )
}