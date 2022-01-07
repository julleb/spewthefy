var express = require('express');
var fs = require("fs");


var playlistDirectory = "playlists/";


module.exports =  {

    PLAYLIST_NOT_FOUND: "playlist not found",
    TRACK_NOT_FOUND: "track not found",

    

    getPlayListPath: function(name) {
        return playlistDirectory + name;
    },
    
    createPlayListDirectory: async function() {
        if (!fs.existsSync(playlistDirectory)){
            fs.mkdirSync(playlistDirectory);
        }
    },

    getPlaylists: async function() {
        playLists = [];
        fs.readdirSync(playlistDirectory).forEach(file => {
            playLists.push(file);
         });
         return playLists;
    },

    createPlaylist: async function(name) {
        var pathToPlayList = this.getPlayListPath(name);
        if (fs.existsSync(pathToPlayList)){
            throw Error("playlist already exists");
        }
        fs.writeFileSync(pathToPlayList, "[]");
    },

    getPlaylist: async function(name) {
        var pathToPlayList = this.getPlayListPath(name);
        if (!fs.existsSync(pathToPlayList)){
            throw Error(this.PLAYLIST_NOT_FOUND);
        }
        data = fs.readFileSync(pathToPlayList);
        json = JSON.parse(data);
        return json;
    },

    updatePlaylistWithTrack: async function (playlistName, track) {
        var pathToPlayList = this.getPlayListPath(playlistName);
        if (!fs.existsSync(pathToPlayList)){
            throw Error(this.PLAYLIST_NOT_FOUND);
        }
        data = fs.readFileSync(pathToPlayList);
        playList = JSON.parse(data)
        playList.push(track);
        fs.writeFileSync(pathToPlayList, JSON.stringify(playList));
    }, 

    deleteTrackFromPlayList: async function(playlistName, youtubeUrl) {
        var pathToPlayList = this.getPlayListPath(playlistName);
        if (!fs.existsSync(pathToPlayList)){
            throw Error(this.PLAYLIST_NOT_FOUND);
        }
        data = fs.readFileSync(pathToPlayList);
        playList = JSON.parse(data);
        var removed = await this.removeTrackFromPlaylistFile(playList, youtubeUrl);
        if(removed) {
            fs.writeFileSync(pathToPlayList, JSON.stringify(playList));
            return true;
        }else {
            throw Error(this.TRACK_NOT_FOUND);
        }
    },

    removeTrackFromPlaylistFile: async function (playList, youtubeUrl) {
        var removed = false;
        playList.map((track) => {
            if(track.youtubeUrl === youtubeUrl) {
                playList.pop(track);
                removed = true;
            }
        });
        return removed;
    }


};