exports.Admins = [
  {
    id: 3,
    nom: "Perralta",
    prenom: "Gérard",
    mail: "g.perralta@gmail.coml",
    password: "123",
  },
  {
    id: 4,
    nom: "Dupond",
    prenom: "Eric",
    mail: "d.eric@gmail.coml",
    password: "derick",
  },
];

exports.Camionneurs = [
  {
    id: 1,
    nom: "Dubois",
    prenom: "Francis",
  },
  {
    id: 2,
    nom: "Sanchez",
    prenom: "Pedro",
  },
];

exports.Grutiers = [
  {
    id: 5,
    nom: 'Raoult',
    prenom: "Didier",
  },
  {
    id: 6,
    nom: 'Johnson',
    prenom: "Boris",
  },
]

exports.Chantiers = [
  {
    id: 1,
    nom: "Chantier Jacou",
    lieuChargementId: 1,
    lieuDéchargementId: 2,
  },
  {
    id: 2,
    nom: "Chantier Montpellier Sud",
    lieuChargementId: 3,
    lieuDéchargementId: 2,
  },
];

exports.Lieux = [
  {
    id: 1,
    adresse: '10 avenue de la Liberté',
    latitude: 78.22226,
    longitude: 127.26325,
  },
  {
    id: 2,
    adresse: '254 boulevard Hughes Renet',
    latitude: 178.265,
    longitude: 317.23,
  },
  {
    id: 3,
    adresse: '27 rue Alphonse Daudet',
    latitude: 854.3621,
    longitude: 99.21548,
  },
]

exports.Etapes = [
  {
    id: 1,
    dateDebut: 1586344415,
    dateFin: 1586348015,
    type: "chargement",
    tempsManoeuvre: 75,
    CamionneurId: 1,
    ChantierId: 1,
  },
  {
    id: 2,
    dateDebut: 1586344415,
    type: "déchargement",
    tempsManoeuvre: 127,
    CamionneurId: 2,
    ChantierId: 1,
  },
  {
    id: 3,
    dateDebut: 1586355215,
    type: "chargement",
    tempsManoeuvre: 112,
    CamionneurId: 2,
    ChantierId: 2,
  },
];
