import YoutubeSearch from "youtube-api-search";
import React, {useState, useEffect} from "react";
import ServerApi from "./ServerApi";
import {v4 as uuidv4} from "uuid";

export function YoutubeSearcher({playListName, playList, setPlayList}) {
  const youtubeThumbNailUrlBase = "https://img.youtube.com/vi/";
  const youtubeUrlBase = "https://www.youtube.com/watch?v=";
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");

  function searchYoutubeVideo(searchText) {
    if (!searchText || searchText.length <= 1) {
      setVideos([]);
      return;
    }

    YoutubeSearch(
      {key: process.env.REACT_APP_YOUTUBE_SEARCH_API_KEY, term: searchText},
      (videos) => {
        setVideos(
          videos.map((video) => {
            const videoId = video.id.videoId;
            video.snippet.thumbnailUrl =
              youtubeThumbNailUrlBase + videoId + "/3.jpg";
            video.snippet.videoUrl = youtubeUrlBase + videoId;
            video.uuid = uuidv4();
            return video;
          })
        );
      }
    );

    //const videoOne = mockSearchResultItem("5abamRO41fE", "Slipknot - psychosocial");
    //const videoTwo = mockSearchResultItem("aCyGvGEtOwc", "Paramore - Misery Business");
    //const videoThree = mockSearchResultItem("UDVtMYqUAyw", "Interstellar");
    //setVideos([...videos, videoOne, videoTwo, videoThree]);

    //mockning
    /*
        const track1 = {youtubeUrl: videoOne.id.videoUrl, title: videoOne.snippet.title, thumbNail: videoOne.snippet.thumbnailUrl};
        const track2 = {youtubeUrl: videoTwo.id.videoUrl, title: videoTwo.snippet.title, thumbNail: videoTwo.snippet.thumbnailUrl};
        const track3 = {youtubeUrl: videoThree.id.videoUrl, title: videoThree.snippet.title, thumbNail: videoThree.snippet.thumbnailUrl};
        var myPlayList = [track1, track2, track3];
        */
    //setPlayList(myPlayList);
  }

  //   function mockSearchResultItem(videoId, title) {
  //     const video = {};
  //     video.snippet = {};
  //     video.id = {};
  //     video.id.videoId = videoId;
  //     video.snippet.thumbnailUrl =
  //       youtubeThumbNailUrlBase + video.id.videoId + "/3.jpg";
  //     video.snippet.title = title;
  //     video.id.videoUrl = youtubeUrlBase + video.id.videoId;
  //     video.uuid = uuidv4();
  //     return video;
  //   }

  async function addToPlayList(video) {
    const track = {
      uuid: video.uuid,
      youtubeUrl: video.snippet.videoUrl,
      title: video.snippet.title,
      thumbNail: video.snippet.thumbnailUrl,
    };
    await ServerApi.addTrackToPlayList(playListName, track).then((response) => {
      if (response.ok) {
        setPlayList([...playList, track]);
      } else {
        console.error("Failed to add track to playlist " + track.title);
      }
    });
  }

  //querying youtube each 1500ms
  useEffect(() => {
    const timeOutId = setTimeout(() => searchYoutubeVideo(query), 1500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  return (
    <div>
      <input
        className="mb-1"
        type="text"
        name="youtube-text"
        onChange={(event) => setQuery(event.target.value)}
      />
      <div>
        <h2>Search Result</h2>
        <div className="d-flex justify-content-center">
          <ul className="list-group">
            {videos?.map((video) => (
              <li
                key={video.uuid}
                className="d-flex flex-row justify-content-between align-items-center list-group-item"
              >
                <img src={video.snippet.thumbnailUrl} alt="alternative?"></img>
                <div>{video.snippet.title}</div>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-success"
                    onClick={() => addToPlayList(video)}
                  >
                    Add
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
