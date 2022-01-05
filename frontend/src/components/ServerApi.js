
const backendBaseUrl = 'http://localhost:8081/';


const audioBaseEndpoint =  backendBaseUrl + "audio?url=";
const playListEndpoint =  backendBaseUrl + "playlist";


const ServerApi = {
    createPlayList: function(playListName) {
        return fetch(playListEndpoint, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playListName
              })
        });
    },

    getAudioUrl: function(trackUrl) {
        return audioBaseEndpoint + trackUrl;
    },

    addTrackToPlayList: function(playListName, track) {
        return fetch(playListEndpoint + "/" + playListName, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                track: track
              })
        });
    },

    getPlayList: function(playListName) {
        return fetch(playListEndpoint + "/" + playListName, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    getPlayLists: function() {
        return fetch(playListEndpoint, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    removeFromPlayList: function(playListName, youtubeUrl) {
        return fetch(playListEndpoint + "/" + playListName + "?url=" + youtubeUrl, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
export default ServerApi;


