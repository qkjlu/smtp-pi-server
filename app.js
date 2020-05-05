require("dotenv").config();
const jwt = require("express-jwt");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const routes = require("./routes");
const _ = require("lodash");
const sequelize = require("./models").sequelize;
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(
  jwt({ secret: process.env.JWT_SECRET }).unless({
    path: [
      /.*\/authenticate/,
      "/",
      { url: "/entreprises", methods: ["GET"] },
      "/io",
      "/socketdoc/index.html",
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
      "Lien vers la doc socket : <a href=/socketdoc/index.html> Socket SMTP </a>"
  );
});

app.get("/io", (req, res) => {
  res.sendFile(__dirname + "/io.html");
});

http.listen(port, function () {
  console.log("Application listening on port " + port);
});

let usersData = {};
let routesChantiers = {};

io.on("connection", (socket) => {
  let socketUserId;
  let socketChantierId;
  let socketConnectedToChantier = false;

  // Le client se connecte à un chantier (room)
  socket.on("chantier/connect", (data) => {
    usersData = {
      ...usersData,
      [data.userId]: {
        chantierId: data.chantierId,
        coordinates: { longitude: -1, latitude: -1 },
      },
    };
    socketConnectedToChantier = true;
    socketUserId = data.userId;
    socketChantierId = data.chantierId;
    socket.join(`chantier:${data.chantierId}`, () => {
      socket.to(`chantier:${data.chantierId}`).emit("chantier/user/connected", {
        userId: data.userId,
      });
    });

    // Récupérer une route avec OpenRouteService
    socket.on("chantier/routes", async () => {
      if (!_.has(routes, `chantier:${socketChantierId}`)) {
        const res = await sequelize.model("Chantier").findByPk(socketChantierId).get();
        console.log(res);
        const apiKey = process.env.ORS_KEY;
        const {
          lieuxChargement: start,
          lieuxDéchargement: end,
        } = await sequelize.model("Chantier").findByPk(socketChantierId).get();
        console.log(start, end);
        // const routes = await fetch({
        //   method: "GET",
        //   url : ""
        // })
      }
    });

    // Le client se déconnecte d'un chantier
    socket.on("chantier/disconnect", () => {
      socketConnectedToChantier = false;
      socketChantierId = undefined;
      socket
        .to(`chantier:${data.chantierId}`)
        .emit("chantier/user/disconnected", { userId: socketUserId });
    });

    // Le client envoie ses coordonnées GPS au chantier
    socket.on("chantier/sendCoordinates", (coordinates) => {
      if (!socketConnectedToChantier) {
        socket.to(socket.conn).emit("erreur", {
          msg:
            "Erreur : il faut être connecté à un chantier pour envoyer les coordonnées GPS",
        });
      } else {
        socket
          .to(`chantier:${socketChantierId}`)
          .emit("chantier/user/sentCoordinates", {
            userId: socketUserId,
            coordinates,
          });
      }
    });
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
