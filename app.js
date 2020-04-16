var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
//var routes = require("./routes");
var cors = require('cors');
const port = 3000



//app.use(cors())
// app.use(express.json())
// app.use("/admins", routes.admins);
// app.use("/camionneurs", routes.camionneurs);
// app.use("/chantiers", routes.chantiers);
// app.use("/etapes", routes.etapes);
// app.use("/grutiers", routes.grutiers);
// app.use("/lieux", routes.lieux);
// app.use("/db", routes.db);

http.listen(port, function () {
  console.log("listening on *:3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.broadcast.emit("user connected");
  socket.on("disconnect", function () {
    console.log("user disconnected");
    socket.broadcast.emit("user disconnected");
  });
  socket.on("chat message", function (msg) {
    console.log("message: " + msg.nickname + " : " + msg.content);
    socket.broadcast.emit("chat message", msg);
  });
  socket.on("is typing", function (nickname) {
    console.log(nickname + " is typing");
    socket.broadcast.emit("is typing", nickname);
  });
  socket.on("stop typing", function () {
    console.log("stop typing");
    socket.broadcast.emit("stop typing");
  });
});
