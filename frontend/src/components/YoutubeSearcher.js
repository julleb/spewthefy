import YoutubeSearch from 'youtube-api-search'
import React, { useState, useCallback, useEffect }  from 'react';

export function YoutubeSearcher({playList, setPlayList}) {
    const API_KEY = "XXX";
    const youtubeThumbNailUrlBase = "https://img.youtube.com/vi/"
    const youtubeUrlBase = "https://www.youtube.com/watch?v=";
    const [videos, setVideos] = useState([]);
    const [query, setQuery] = useState("");

    function searchYoutubeVideo(searchText) {
        /*
        YoutubeSearch({key: API_KEY, term: searchText}, videos => {
            for (var i=0; i < videos.length; i++) {
                const videoId = videos[i].id.videoId;
                videos[i].snippet.thumbnailUrl = youtubeThumbNailUrlBase + videoId + "/3.jpg";
                videos[i].snippet.videoUrl = youtubeUrlBase + videoId;
            } 
            setVideos(videos);
        });
        */
        const videoOne = mockSearchResultItem("5abamRO41fE", "Slipknot - psychosocial");
        const videoTwo = mockSearchResultItem("aCyGvGEtOwc", "Paramore - Misery Business");
        setVideos([...videos, videoOne, videoTwo]);
    }

    function mockSearchResultItem(videoId, title) {
        const video = {};
        video.snippet = {};
        video.id ={};
        video.id.videoId = videoId
        video.snippet.thumbnailUrl = youtubeThumbNailUrlBase +  video.id.videoId + "/3.jpg";
        video.snippet.title = title;
        video.id.videoUrl = youtubeUrlBase + video.id.videoId;
        return  video;
    }

    function addToPlayList(video) {
        console.log(video);
        console.log(video.snippet.title);
        const playListItem = {youtubeUrl: video.id.videoUrl, title: video.snippet.title};
        setPlayList([...playList, playListItem]);
    }

      //querying youtube each 1500ms
      useEffect (() => {
        const timeOutId = setTimeout(() => searchYoutubeVideo(query), 500);
        return () => clearTimeout(timeOutId);
      }, [query]);

    return (
        <div>
            <input type="text" name="youtube-text" onChange={event => setQuery(event.target.value)}/><br/>
            <div>
                <h2>Search Result</h2>
                <ol>
                    {videos.map((video) =>  
                            <li>
                                <div>
                                   <img src={video.snippet.thumbnailUrl} alt="alternative?"></img>
                                   {video.id.videoId} {video.snippet.title}
                                   <button onClick={() => addToPlayList(video)}>Add</button>
                                </div>
                            </li> 
                        )
                    } 
                </ol> 
            </div>
        </div>
    )
}