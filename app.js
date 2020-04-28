require("dotenv").config();
const Generator = require("asyncapi-generator")
var jwt = require("express-jwt");
var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var routes = require("./routes");
const path = require('path');
const port = process.env.PORT || 3000;
const generator = new Generator('html', path.resolve(__dirname, 'socketdoc'));

app.use(express.static('public'))
app.use(express.json());
app.use(
  jwt({ secret: process.env.JWT_SECRET }).unless({
    path: [
      /.*\/authenticate/,
      "/",
      { url: "/entreprises", methods: ["GET"] },
      "/io",
      "/public/socketdoc/index.html",
      "/favicon.ico",
    ],
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
    "Bienvenue sur l'API SMTP, lien vers la doc : <a href=https://stoplight.io/p/docs/gh/qkjlu/smtp-pi-server> API SMTP </a> \n" +
    "Lien vers la doc socket : <a href=/public/socketdoc/index.html> Socket SMTP </a>"
  );
});

app.get("/io", (req, res) => {
  res.sendFile(__dirname + "/io.html");
});


http.listen(port, function () {
  console.log("Application listening on port " + port);
});



io.on("connection", (socket) => {
  let userId;
  let chantierId;
  let connectedToChantier = false;

  // Le client se connecte à un chantier (room)
  socket.on("chantier/connect", (data) => {
    connectedToChantier = true;
    userId = data.userId;
    chantierId = data.chantierId;
    socket.join(`chantier:${data.chantierId}`, () => {
      socket.to(`chantier:${data.chantierId}`).emit("chantier/user/connected", {
        userId: data.userId,
        coordinates: data.coordinates,
      });
    });
  });

  // Le client se déconnecte d'un chantier
  socket.on("chantier/disconnect", () => {
    connectedToChantier = false;
    chantierId = undefined;
    socket
      .to(`chantier:${data.chantierId}`)
      .emit("chantier/user/disconnected", { userId });
  });

  // Le client envoie ses coordonnées GPS au chantier
  socket.on("chantier/sendCoordinates", (coordinates) => {
    console.log(coordinates);
    if (!connectedToChantier) {
      socket.to(socket.conn).emit("error", {
        msg:
          "Erreur : il faut être connecté à un chantier pour envoyer les coordonnées GPS",
      });
    } else {
      socket
        .to(`chantier:${chantierId}`)
        .emit("chantier/user/sentCoordinates", { userId, coordinates });
    }
  });
  // socket.broadcast.emit("user connected");
  // socket.on("disconnect", function () {
  //   console.log("user disconnected");
  //   socket.broadcast.emit("user disconnected");
  // });
  // socket.on("chat message", function (msg) {
  //   console.log("message: " + msg.nickname + " : " + msg.content);
  //   socket.broadcast.emit("chat message", msg);
  // });
  // socket.on("is typing", function (nickname) {
  //   console.log(nickname + " is typing");
  //   socket.broadcast.emit("is typing", nickname);
  // });
  // socket.on("stop typing", function () {
  //   console.log("stop typing");
  //   socket.broadcast.emit("stop typing");
  // });
});
