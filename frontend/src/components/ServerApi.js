
const backendBaseUrl = 'http://localhost:8081/';


const audioBaseEndpoint =  backendBaseUrl + "audio?url=";
const createPlayListEndpoint =  backendBaseUrl + "playlist";


const ServerApi = {
    createPlayList: function(playListName) {
        return fetch(createPlayListEndpoint, {
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
    }
}
export default ServerApi;


