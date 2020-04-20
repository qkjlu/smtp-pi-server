const uuid = require("uuid").v4;

const dateNow = new Date().toISOString();
const uuidAdmins = [uuid(), uuid()];
const Admins = [
  {
    id: uuidAdmins[0],
    nom: "Perralta",
    prenom: "Gérard",
    mail: "g.perralta@gmail.coml",
    password: "123",
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    id: uuidAdmins[1],
    nom: "Dupond",
    prenom: "Eric",
    mail: "d.eric@gmail.coml",
    password: "derick",
    createdAt: dateNow,
    updatedAt: dateNow
  },
];
const uuidCamionneurs = [uuid(), uuid()];
const Camionneurs = [
  {
    id: uuidCamionneurs[0],
    nom: "Dubois",
    prenom: "Francis",
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    id: uuidCamionneurs[1],
    nom: "Sanchez",
    prenom: "Pedro",
    createdAt: dateNow,
    updatedAt: dateNow
  },
];
const uuidGrutiers = [uuid(), uuid()];
const Grutiers = [
  {
    id: uuidGrutiers[0],
    nom: "Raoult",
    prenom: "Didier",
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    id: uuidGrutiers[1],
    nom: "Johnson",
    prenom: "Boris",
    createdAt: dateNow,
    updatedAt: dateNow
  },
];
const uuidChantiers = [uuid(), uuid()];
const uuidLieux = [uuid(), uuid(), uuid()];
const Chantiers = [
  {
    id: uuidChantiers[0],
    nom: "Chantier Jacou",
    lieuChargementId: uuidLieux[0],
    lieuDéchargementId: uuidLieux[1],
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    id: uuidChantiers[1],
    nom: "Chantier Montpellier Sud",
    lieuChargementId: uuidLieux[2],
    lieuDéchargementId: uuidLieux[1],
    createdAt: dateNow,
    updatedAt: dateNow
  },
];
const Lieux = [
  {
    id: uuidLieux[0],
    adresse: "10 avenue de la Liberté",
    latitude: 78.22226,
    longitude: 127.26325,
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    id: uuidLieux[1],
    adresse: "254 boulevard Hughes Renet",
    latitude: 178.265,
    longitude: 317.23,
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    id: uuidLieux[2],
    adresse: "27 rue Alphonse Daudet",
    latitude: 854.3621,
    longitude: 99.21548,
    createdAt: dateNow,
    updatedAt: dateNow
  },
];
const uuidEtapes = [uuid(), uuid(), uuid()];
const Etapes = [
  {
    id: uuidEtapes[0],
    dateDebut: dateNow,
    dateFin: dateNow,
    type: "chargement",
    tempsManoeuvre: 75,
    CamionneurId: uuidCamionneurs[0],
    ChantierId: uuidChantiers[0],
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    id: uuidEtapes[1],
    dateDebut: dateNow,
    type: "déchargement",
    tempsManoeuvre: 127,
    CamionneurId: uuidCamionneurs[0],
    ChantierId: uuidChantiers[0],
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    id: uuidEtapes[2],
    dateDebut: dateNow,
    type: "chargement",
    tempsManoeuvre: 112,
    CamionneurId: uuidCamionneurs[1],
    ChantierId: uuidChantiers[1],
    createdAt: dateNow,
    updatedAt: dateNow
  },
];
const uuidEntreprises = [uuid(), uuid()];
const Entreprises = [
  {
    id: uuidEntreprises[0],
    nom: "SMTP34",
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    id: uuidEntreprises[1],
    nom: "Altrad",
    createdAt: dateNow,
    updatedAt: dateNow
  },
];
const LieuGrutier = [
  {
    LieuId: uuidLieux[0],
    GrutierId: uuidGrutiers[0],
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    LieuId: uuidLieux[1],
    GrutierId: uuidGrutiers[1],
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    LieuId: uuidLieux[0],
    GrutierId: uuidGrutiers[1],
    createdAt: dateNow,
    updatedAt: dateNow
  },
];
const ChantierCamionneur = [
  {
    CamionneurId: uuidCamionneurs[0],
    ChantierId: uuidChantiers[1],
    createdAt: dateNow,
    updatedAt: dateNow
  },
  {
    CamionneurId: uuidCamionneurs[1],
    ChantierId: uuidChantiers[0],
    createdAt: dateNow,
    updatedAt: dateNow
  },
];

module.exports = { Lieux, Entreprises, Camionneurs, Admins, Grutiers, Chantiers, Etapes, ChantierCamionneur, LieuGrutier }