const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
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

// SOCKETS
// Initialise le fichier json si il n'existe pas
db.defaults({ users: [], routes: [] }).write();
io.on("connection", (socket) => {
  // Initialise les informations liées à la socket
  let socketInfo = { id: "", chantier: "", connected: false };

  // Le client se connecte à un chantier (room)
  socket.on("chantier/connect", async (data) => {
    // Enregistre les informations liées à la socket
    socketInfo.connected = true;
    socketInfo.id = data.userId;
    socketInfo.chantier = data.chantierId;

    // Récupère les données précédemment persistées, les initialisent sinon
    let storedUser = db.get("users").find({ id: data.userId }).value();

    if (storedUser == undefined) {
      // L'utilisateur n'a pas été persisté précédemment

      // Initialise l'utilisateur à persister
      storedUser = {
        id: data.userId,
        chantierId: data.chantierId,
        coordinates: data.coordinates || {},
        etat: "déchargé",
        previousEtat: "",
      };

      // Persiste l'utilisateur dans le fichier json
      db.get("users").push(storedUser).write();
    }

    // Ajoute l'utilisateur dans la room du chantier
    socket.join(`chantier:${data.chantierId}`, () => {
      // Notifie tous les utilisateurs de la room qu'un nouvel utilisateur s'est connecté
      socket.to(`chantier:${data.chantierId}`).emit("chantier/user/connected", {
        userId: storedUser.id,
        coordinates: storedUser.coordinates,
        etat: storedUser.etat,
        previousEtat: storedUser.previousEtat,
      });

      // Notifie l'utilisateur que la connexion à la room a réussi
      socket.to(socket.conn).emit("chantier/connect/success", {
        coordinates: storedUser.coordinates,
        etat: storedUser.etat,
        previousEtat: storedUser.previousEtat,
      });
    });

    // Récupérer une route avec OpenRouteService
    socket.on("chantier/routes", async () => {
      if (!_.has(routes, `chantier:${socketInfo.chantier}`)) {
        const apiKey = process.env.ORS_KEY;
        const { lieuxChargement: start, lieuxDéchargement: end } = (
          await sequelize.model("Chantier").findByPk(socketInfo.chantier)
        ).get();
        console.log(start, end);
        // const routes = await fetch({
        //   method: "GET",
        //   url : ""
        // })
      }
    });

    // Le client se déconnecte d'un chantier
    socket.on("chantier/disconnect", () => {
      // Notifie les utilisateurs de la room qu'un utilisateur s'est déconnecté
      socket
        .to(`chantier:${socketInfo.chantier}`)
        .emit("chantier/user/disconnected", { userId: socketInfo.id });

      socketInfo.connected = false;
      socketInfo.chantier = undefined;
    });

    // Le client envoie ses coordonnées GPS au chantier
    socket.on("chantier/sendCoordinates", (data) => {
      if (!socketInfo.connected) {
        // Notifie l'utilisateur d'une erreur
        socket.to(socket.conn).emit("erreur", {
          msg:
            "Erreur : il faut être connecté à un chantier pour envoyer les coordonnées GPS",
        });
      } else {
        // Persiste les données reçues
        db.get("users")
          .find({ id: socketInfo.id })
          .assign({
            coordinates: data.coordinates,
            etat: data.etat,
            previousEtat: data.etat,
          })
          .write();

        // Notifie les utilisateurs de la room qu'un utilisateur a envoyé de nouvelles coordonnées
        socket
          .to(`chantier:${socketInfo.chantier}`)
          .emit("chantier/user/sentCoordinates", {
            userId: socketInfo.id,
            coordinates: data.coordinates,
            etat: data.etat,
            previousEtat: data.previousEtat,
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
