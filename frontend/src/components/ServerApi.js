const backendBaseUrl = "http://localhost:8081/";

const audioBaseEndpoint = backendBaseUrl + "audio?url=";
const playListEndpoint = backendBaseUrl + "playlist";

const ServerApi = {
  createPlayList: function (playListName) {
    return fetch(playListEndpoint, {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playListName,
      }),
    });
  },

  getAudioUrl: function (trackUrl) {
    return audioBaseEndpoint + trackUrl;
  },

  addTrackToPlayList: function (playListName, track) {
    return fetch(playListEndpoint + "/" + playListName, {
      method: "put",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        track: track,
      }),
    });
  },

  getPlayList: function (playListName) {
    return fetch(playListEndpoint + "/" + playListName, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  getPlayLists: function () {
    return fetch(playListEndpoint, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  removeFromPlayList: function (playListName, uuid) {
    return fetch(playListEndpoint + "/" + playListName + "?uuid=" + uuid, {
      method: "delete",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  login: function (username, password) {
    return fetch(backendBaseUrl + "login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: username, password: password}),
    });
  },
};
export default ServerApi;
