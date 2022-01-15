var express = require("express");
var fs = require("fs");

var playlistDirectory = "playlists/";
var playlistNameRegex = /^[A-Za-z0-9_]+$/;

module.exports = {
  PLAYLIST_NOT_FOUND: "playlist not found",
  TRACK_NOT_FOUND: "track not found",

  getPlayListPath: function (name) {
    return playlistDirectory + name;
  },

  createPlayListDirectory: async function () {
    if (!fs.existsSync(playlistDirectory)) {
      fs.mkdirSync(playlistDirectory);
    }
  },

  getPlaylists: async function () {
    playLists = [];
    fs.readdirSync(playlistDirectory).forEach((file) => {
      playLists.push(file);
    });

    return playLists;
  },

  getPlayListsOfUser: async function (username) {
    playLists = await this.getPlaylists();
    return playLists
      .filter(function (playList) {
        return playList.startsWith(username + "_");
      })
      .map((playList) => {
        return playList.split("_")[1];
      });
  },

  createPlaylist: async function (name) {
    if (!playlistNameRegex.test(name)) {
      throw Error("playlist must only contain...characters");
    }
    var pathToPlayList = this.getPlayListPath(name);
    if (fs.existsSync(pathToPlayList)) {
      throw Error("playlist already exists");
    }
    fs.writeFileSync(pathToPlayList, "[]");
  },

  getPlaylist: async function (name) {
    if (!playlistNameRegex.test(name)) {
      throw Error(this.PLAYLIST_NOT_FOUND);
    }
    var pathToPlayList = this.getPlayListPath(name);
    if (!fs.existsSync(pathToPlayList)) {
      throw Error(this.PLAYLIST_NOT_FOUND);
    }
    data = fs.readFileSync(pathToPlayList);
    json = JSON.parse(data);
    return json;
  },

  updatePlaylistWithTrack: async function (playlistName, track) {
    if (!playlistNameRegex.test(playlistName)) {
      throw Error(this.PLAYLIST_NOT_FOUND);
    }
    var pathToPlayList = this.getPlayListPath(playlistName);
    if (!fs.existsSync(pathToPlayList)) {
      throw Error(this.PLAYLIST_NOT_FOUND);
    }
    data = fs.readFileSync(pathToPlayList);
    playList = JSON.parse(data);
    playList.push(track);
    fs.writeFileSync(pathToPlayList, JSON.stringify(playList));
  },

  deleteTrackFromPlayList: async function (playlistName, uuid) {
    if (!playlistNameRegex.test(nplaylistNameame)) {
      throw Error(this.PLAYLIST_NOT_FOUND);
    }
    var pathToPlayList = this.getPlayListPath(playlistName);
    if (!fs.existsSync(pathToPlayList)) {
      throw Error(this.PLAYLIST_NOT_FOUND);
    }
    data = fs.readFileSync(pathToPlayList);
    playList = JSON.parse(data);
    var obj = await this.removeTrackFromPlaylistFile(playList, uuid);
    removed = obj.removed;
    playList = obj.playList;
    if (removed) {
      fs.writeFileSync(pathToPlayList, JSON.stringify(playList));
      return true;
    } else {
      throw Error(this.TRACK_NOT_FOUND);
    }
  },

  removeTrackFromPlaylistFile: async function (playList, uuid) {
    var removed = false;
    filteredPlaylist = playList.filter(function (track) {
      return track.uuid !== uuid;
    });
    removed = playList.length !== filteredPlaylist;
    playList = filteredPlaylist;
    return { removed: removed, playList: filteredPlaylist };
  },
};
