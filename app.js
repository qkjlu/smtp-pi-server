require("dotenv").config();
var jwt = require("express-jwt");
var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var routes = require("./routes");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  jwt({ secret: process.env.JWT_SECRET }).unless({
    path: [/.*\/authenticate/, "/",  { url: '/entreprises', methods: ['GET']  }]
  })
);
app.use("/admins", routes.admins);
app.use("/camionneurs", routes.camionneurs);
app.use("/chantiers", routes.chantiers);
app.use("/etapes", routes.etapes);
app.use("/grutiers", routes.grutiers);
app.use("/lieux", routes.lieux);
app.use("/entreprises", routes.entreprises);

app.get("/", (req, res) => {
  res.send(
    "Bienvenue sur l'API SMTP, lien vers la doc : <a href=https://stoplight.io/p/docs/gh/qkjlu/smtp-pi-server> API SMTP </a>"
  );
});

http.listen(port, function () {
  console.log("Application listening on port " + port);
});

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.broadcast.emit("user connected");
//   socket.on("disconnect", function () {
//     console.log("user disconnected");
//     socket.broadcast.emit("user disconnected");
//   });
//   socket.on("chat message", function (msg) {
//     console.log("message: " + msg.nickname + " : " + msg.content);
//     socket.broadcast.emit("chat message", msg);
//   });
//   socket.on("is typing", function (nickname) {
//     console.log(nickname + " is typing");
//     socket.broadcast.emit("is typing", nickname);
//   });
//   socket.on("stop typing", function () {
//     console.log("stop typing");
//     socket.broadcast.emit("stop typing");
//   });
// });
