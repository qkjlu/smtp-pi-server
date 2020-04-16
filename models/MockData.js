const uuid = require("uuid").v4;

const uuidAdmins = [uuid(), uuid()];
exports.Admins = [
  {
    id: uuidAdmins[0],
    nom: "Perralta",
    prenom: "Gérard",
    mail: "g.perralta@gmail.coml",
    password: "123",
  },
  {
    id: uuidAdmins[1],
    nom: "Dupond",
    prenom: "Eric",
    mail: "d.eric@gmail.coml",
    password: "derick",
  },
];
const uuidCamionneurs = [uuid(), uuid()];
exports.Camionneurs = [
  {
    id: uuidCamionneurs[0],
    nom: "Dubois",
    prenom: "Francis",
  },
  {
    id: uuidCamionneurs[1],
    nom: "Sanchez",
    prenom: "Pedro",
  },
];
const uuidGrutiers = [uuid(),uuid()];
exports.Grutiers = [
  {
    id: uuidGrutiers[0],
    nom: "Raoult",
    prenom: "Didier",
  },
  {
    id: uuidGrutiers[1],
    nom: "Johnson",
    prenom: "Boris",
  },
];
const uuidChantiers = [uuid(), uuid()];
const uuidLieux = [uuid(), uuid(), uuid()];
exports.Chantiers = [
  {
    id: uuidChantiers[0],
    nom: "Chantier Jacou",
    lieuChargementId: uuidLieux[0],
    lieuDéchargementId: uuidLieux[1],
  },
  {
    id: uuidChantiers[1],
    nom: "Chantier Montpellier Sud",
    lieuChargementId: uuidLieux[2],
    lieuDéchargementId: uuidLieux[1],
  },
];

exports.Lieux = [
  {
    id: uuidLieux[0],
    adresse: "10 avenue de la Liberté",
    latitude: 78.22226,
    longitude: 127.26325,
  },
  {
    id: uuidLieux[1],
    adresse: "254 boulevard Hughes Renet",
    latitude: 178.265,
    longitude: 317.23,
  },
  {
    id: uuidLieux[2],
    adresse: "27 rue Alphonse Daudet",
    latitude: 854.3621,
    longitude: 99.21548,
  },
];
const uuidEtapes = [uuid(), uuid(), uuid()];
exports.Etapes = [
  {
    id: uuidEtapes[0],
    dateDebut: 1586344415,
    dateFin: 1586348015,
    type: "chargement",
    tempsManoeuvre: 75,
    CamionneurId: uuidCamionneurs[0],
    ChantierId: uuidChantiers[0],
  },
  {
    id: uuidEtapes[1],
    dateDebut: 1586344415,
    type: "déchargement",
    tempsManoeuvre: 127,
    CamionneurId: uuidCamionneurs[0],
    ChantierId: uuidChantiers[0],
  },
  {
    id: uuidEtapes[2],
    dateDebut: 1586355215,
    type: "chargement",
    tempsManoeuvre: 112,
    CamionneurId: uuidCamionneurs[1],
    ChantierId: uuidChantiers[1],
  },
];
