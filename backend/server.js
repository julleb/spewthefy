var express = require('express');
var app = express();
var fs = require("fs");
const youtube_streamer = require('youtube-audio-stream')
app.use(express.json());
var cors = require('cors');

var playlistDirectory = "playlists/";

function createPlayListDirectory() {
    if (!fs.existsSync(playlistDirectory)){
        fs.mkdirSync(playlistDirectory);
    }
}
createPlayListDirectory();



app.use(cors({
    origin: '*'
}));

app.get('/', function (req, res) {
    console.log("Text: " + req.query.text);
   res.status(200).send("Hello!");
});

app.post('/playlist', function (req, res) {
    var playlist = req.body.name;
    if(!playlist) {
        res.status(500).send("No name given");
    }
    fs.writeFileSync(playlistDirectory + playlist, "[]", (err) => {if (err) res.status(500).send("failed to create playlist")});
    res.status(200).send("created");
});

app.get('/playlist', function(req, res) {
    playLists = [];
    fs.readdirSync(playlistDirectory).forEach(file => {
        playLists.push(file);
      });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(playLists));
});

app.put('/playlist/:name', function(req, res) {
    track = req.body.track;
    playlistName = req.params.name
    if(!track) res.status(500).send("no track object sent");
    var pathToPlayList = playlistDirectory + playlistName;
    if (!fs.existsSync(pathToPlayList)){
        res.status(500).send("playlist does not exist");
    }
    data = fs.readFileSync(pathToPlayList);
    playList = JSON.parse(data)
    playList.push(track);
    fs.writeFileSync(pathToPlayList, JSON.stringify(playList));
    res.status(200).send("");
});

app.delete('/playlist/:name', async function(req, res) {
    playlistName = req.params.name;
    youtubeUrl = req.query.url;
    if(!playlistName || !youtubeUrl) res.status(500).send("bad input");
    var pathToPlayList = playlistDirectory + playlistName;
    if (!fs.existsSync(pathToPlayList)){
        res.status(404).send("playlist not exist");
    }
    data = fs.readFileSync(pathToPlayList);
    playList = JSON.parse(data);
    var removed = await removeTrackFromPlayList(playList, youtubeUrl);
    if(removed) {
        fs.writeFileSync(pathToPlayList, JSON.stringify(playList));
        res.status(200).send("");
    }else {
        res.status(404).send("youtubeUrl is not in the playlist");
    }
    
});

async function removeTrackFromPlayList(playList, youtubeUrl) {
    var removed = false;
    playList.map((track) => {
        if(track.youtubeUrl === youtubeUrl) {
            playList.pop(track);
            removed = true;
        }
    });
    return removed;
}


app.get('/playlist/:name', function(req, res) {
    playlistName = req.params.name;
    var pathToPlayList = playlistDirectory + playlistName;
    if (!fs.existsSync(pathToPlayList)){
        res.status(404).send("playlist not exist");
    }
    data = fs.readFileSync(pathToPlayList);
    json = JSON.parse(data);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(json);
});


app.get('/audio', function (req, res) {
    youtubeUrl = req.query.url
    if(!youtubeUrl) {
        res.status(201).send("No url");
    }
    console.log(youtubeUrl);
    const url = new URL(youtubeUrl);
    if(url.hostname !== "www.youtube.com") {
        res.status(500).send("Bad url");
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