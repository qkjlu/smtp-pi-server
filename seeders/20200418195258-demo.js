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
  EntrepriseCamionneur,
  EntrepriseGrutier
} = require("../models/MockData");
const sequelize = require("../models").sequelize;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await Promise.all([
        queryInterface.bulkInsert("Lieux", Lieux),
        queryInterface.bulkInsert("Camionneurs", Camionneurs),
        queryInterface.bulkInsert("Admins", Admins),
        queryInterface.bulkInsert("Grutiers", Grutiers),
        queryInterface.bulkInsert("Entreprises", Entreprises),
      ]);
      await queryInterface.bulkInsert("Chantiers", Chantiers);
      await queryInterface.bulkInsert("Etapes", Etapes);
      await Promise.all([
        queryInterface.bulkInsert("ChantierCamionneur", ChantierCamionneur),
        queryInterface.bulkInsert("LieuGrutier", LieuGrutier),
        queryInterface.bulkInsert("EntrepriseCamionneur", EntrepriseCamionneur),
        queryInterface.bulkInsert('EntrepriseGrutier', EntrepriseGrutier)
      ]);
    } catch (error) {
      console.log(error);
    }
  },
  down: (queryInterface, Sequelize) => {
    return sequelize.truncate({ cascade: true });
  },
};
