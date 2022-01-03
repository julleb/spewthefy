var express = require('express');
var app = express();
var fs = require("fs");
const youtube_streamer = require('youtube-audio-stream')

app.get('/', function (req, res) {
   res.status(200).send("Hello!");
})


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
 })


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Server started. Listening at http://%s:%s", host, port)
})