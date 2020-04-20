"use strict";
const {
  Lieux,
  Entreprises,
  Camionneurs,
  Admins,
  Grutiers,
  Chantiers,
  Etapes,
  ChantierCamionneur,
  LieuGrutier,
} = require("../models/MockData");
const sequelize = require("../models").sequelize;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert("Lieux", Lieux),
      queryInterface.bulkInsert("Camionneurs", Camionneurs),
      queryInterface.bulkInsert("Admins", Admins),
      queryInterface.bulkInsert("Grutiers", Grutiers),
      queryInterface.bulkInsert("Entreprises", Entreprises),
    ])
      .then(queryInterface.bulkInsert("Chantiers", Chantiers))
      .then(queryInterface.bulkInsert("Etapes", Etapes))
      .then(
        Promise.all([
          queryInterface.bulkInsert("ChantierCamionneur", ChantierCamionneur),
          queryInterface.bulkInsert("LieuGrutier", LieuGrutier),
        ])
      )
      .catch((err) => console.log(err));
  },
  down: (queryInterface, Sequelize) => {},
};
