var express = require('express');
var app = express();
var fs = require("fs");
const youtube_streamer = require('youtube-audio-stream')
app.use(express.json());
var cors = require('cors');

var playlistservice = require('./playlistservice');  
playlistservice.createPlayListDirectory();


app.use(cors({
    origin: '*'
}));

app.get('/', function (req, res) {
    console.log("Text: " + req.query.text);
   res.status(200).send("Hello!");
});

app.post('/playlist', async function (req, res) {
    var playlist = req.body.name;
    if(!playlist) {
        res.status(500).send("No name given");
        return;
    }
    try {
        await playlistservice.createPlaylist(playlist);
        res.status(200).send("created");
    } catch(e) {
        res.status(500).send(e.message);
    }
});

app.get('/playlist', async function(req, res) {
    playLists = await playlistservice.getPlaylists();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(playLists));
});

app.put('/playlist/:name', async function(req, res) {
    track = req.body.track;
    playlistName = req.params.name
    if(!track) res.status(500).send("no track object sent");
    await playlistservice.updatePlaylistWithTrack(playlistName, track);
    res.status(200).send("");
});

app.delete('/playlist/:name', async function(req, res) {
    playlistName = req.params.name;
    uuid = req.query.uuid;
    if(!playlistName || !uuid) res.status(500).send("bad input");

    try {
        removed = await playlistservice.deleteTrackFromPlayList(playlistName, uuid);
        if(removed) {
            res.status(200).send("");
        }else {
            res.status(500).send("failed to remove");
        }
    }catch(e) {
        if(e.message === playlistservice.TRACK_NOT_FOUND || e.message === playlistservice.PLAYLIST_NOT_FOUND) {
             res.status(404);
        }else{
            res.status(500);
        }
        res.send(e.message);
    }
});


app.get('/playlist/:name', async function(req, res) {
    playlistName = req.params.name;
    try {
        const json = await playlistservice.getPlaylist(playlistName);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(json);
    }catch(e) {
        if(e.message === playlistservice.PLAYLIST_NOT_FOUND) {
            res.status(404).send(e.message);
        }else {
            res.status(500).send("failed");
        }
    }
});


app.get('/audio', function (req, res) {
    youtubeUrl = req.query.url
    if(!youtubeUrl) {
        res.status(201).send("No url");
        return;
    }
    try {
        const url = new URL(youtubeUrl);
        if(url.hostname !== "www.youtube.com") {
            res.status(500).send("Bad url");
            return;
        }
    } catch(e) {
        res.status(500).send("bad url");
        return;
    }
    
    try {
        youtube_streamer(youtubeUrl).pipe(res);
        res.set('Cache-Control', 'public, max-age=31557600');
    }catch(err) {
        res.status(500).send("Failed to stream. " + err);
    }
 });


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Server started. Listening at http://%s:%s", host, port)
})