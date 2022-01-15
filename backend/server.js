var express = require("express");
var app = express();
var fs = require("fs");
const youtube_streamer = require("youtube-audio-stream");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
var cors = require("cors");
var playlistservice = require("./playlistservice");
var loginservice = require("./loginservice");
const session = require("express-session");

playlistservice.createPlayListDirectory();
loginservice.init();
app.use(express.json());

function getErrorMessage(message) {
  errorMessage = { message: message };
  return JSON.stringify(errorMessage);
}

const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(
  sessions({
    secret: "YYYYYYYYYYYYYY",
    saveUninitialized: true,
    cookie: { maxAge: oneDay, httpOnly: false, secure: false }, //should be httpsecure in prodenv
    resave: false,
  })
);

function setJsonAsContentType(res) {
  res.setHeader("Content-Type", "application/json");
}

function applicationJson(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  return next();
}

function requireAuthentication(req, res, next) {
  const user = loginservice.getUserFromSession(req);
  if (!user) {
    return res.status(401).send(getErrorMessage("not authenticated"));
  }
  return next();
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", function (req, res) {
  var name = req.session.username;
  if (!name) name = "unknown-user";
  res.status(200).send("Hello " + name);
});

app.post("/user", async function (req, res) {
  setJsonAsContentType(res);
  user = req.body.user;
  if (!user) {
    errorMsg = getErrorMessage("No user object");
    res.status(500).send(errorMsg);
    return;
  }
  try {
    await loginservice.createUser(user.username, user.password);
    res.status(201).send("");
  } catch (err) {
    errorMsg = getErrorMessage(err.message);
    res.status(500).send(errorMsg);
    return;
  }
});

app.post("/login", applicationJson, async function (req, res) {
  username = req.body.username;
  password = req.body.password;
  try {
    authenticated = await loginservice.authenticateUser(username, password);
    if (!authenticated) {
      throw Error("Not ok");
    }
    req.session.username = username;
    return res.status(201).send("");
  } catch (err) {
    errorMsg = getErrorMessage(err.message);
    res.status(500).send(errorMsg);
    return;
  }
});

app.post(
  "/playlist",
  applicationJson,
  requireAuthentication,
  async function (req, res) {
    var playlist = req.body.name;
    if (!playlist) {
      errorMsg = getErrorMessage("No name given");
      res.status(500).send(errorMsg);
      return;
    }
    try {
      username = loginservice.getUserFromSession(req);
      playlist = username + "_" + playlist;
      await playlistservice.createPlaylist(playlist);
      res.status(200).send("");
    } catch (e) {
      errorMsg = getErrorMessage(e.message);
      res.status(500).send(errorMsg);
    }
  }
);

app.get(
  "/playlist",
  applicationJson,
  requireAuthentication,
  async function (req, res) {
    username = loginservice.getUserFromSession(req);
    playLists = await playlistservice.getPlayListsOfUser(username);
    res.status(200).send(JSON.stringify(playLists));
  }
);

app.put(
  "/playlist/:name",
  applicationJson,
  requireAuthentication,
  async function (req, res) {
    track = req.body.track;
    username = loginservice.getUserFromSession(req);
    playlistName = username + "_" + req.params.name;
    if (!track) {
      errorMsg = getErrorMessage("no track object sent");
      res.status(500).send(errorMsg);
      return;
    }
    await playlistservice.updatePlaylistWithTrack(playlistName, track);
    res.status(204).send("");
  }
);

app.delete(
  "/playlist/:name",
  applicationJson,
  requireAuthentication,
  async function (req, res) {
    setJsonAsContentType(res);
    username = loginservice.getUserFromSession(req);
    playlistName = username + "_" + req.params.name;
    uuid = req.query.uuid;
    if (!playlistName || !uuid) {
      errorMsg = getErrorMessage("bad input");
      res.status(500).send(errorMsg);
      return;
    }
    try {
      removed = await playlistservice.deleteTrackFromPlayList(
        playlistName,
        uuid
      );
      if (removed) {
        res.status(201).send("");
      } else {
        errorMsg = getErrorMessage("failed to remove");
        res.status(500).send(errorMsg);
      }
    } catch (e) {
      if (
        e.message === playlistservice.TRACK_NOT_FOUND ||
        e.message === playlistservice.PLAYLIST_NOT_FOUND
      ) {
        res.status(404);
      } else {
        res.status(500);
      }
      errorMsg = getErrorMessage(e.message);
      res.send(errorMsg);
    }
  }
);

app.get(
  "/playlist/:name",
  applicationJson,
  requireAuthentication,
  async function (req, res) {
    setJsonAsContentType(res);
    playlistName = req.params.name;
    try {
      username = loginservice.getUserFromSession(req);
      playlistName = username + "_" + req.params.name;
      const json = await playlistservice.getPlaylist(playlistName);
      res.status(200).send(json);
    } catch (e) {
      if (e.message === playlistservice.PLAYLIST_NOT_FOUND) {
        errorMsg = getErrorMessage(e.message);
        res.status(404).send(errorMsg);
      } else {
        res.status(500).send(getErrorMessage("failed"));
      }
    }
  }
);

app.get("/audio", applicationJson, function (req, res) {
  youtubeUrl = req.query.url;
  if (!youtubeUrl) {
    res.status(201).send(getErrorMessage("no url as query param"));
    return;
  }
  try {
    const url = new URL(youtubeUrl);
    if (url.hostname !== "www.youtube.com") {
      errorMsg = getErrorMessage("bad url");
      res.status(500).send(errorMsg);
      return;
    }
  } catch (e) {
    errorMsg = getErrorMessage("bad url");
    res.status(500).send(errorMsg);
    return;
  }
  try {
    youtube_streamer(youtubeUrl).pipe(res);
    res.set("Cache-Control", "public, max-age=31557600");
  } catch (err) {
    errorMsg = getErrorMessage("Failed to stream. " + err);
    res.status(500).send(errorMsg);
  }
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Server started. Listening at http://%s:%s", host, port);
});
