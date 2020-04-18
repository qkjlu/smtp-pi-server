"use strict";
const { Lieux, Camionneurs, Admins, Grutiers, Chantiers, Etapes, ChantierCamionneur, LieuGrutier } = require("../models/MockData");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert("Lieux", Lieux),
      queryInterface.bulkInsert("Camionneurs", Camionneurs),
      queryInterface.bulkInsert("Admins", Admins),
      queryInterface.bulkInsert("Grutiers", Grutiers)
    ])
      .then(queryInterface.bulkInsert("Chantier", Chantiers))
      .then(queryInterface.bulkInsert("Etapes", Etapes))
      .then(
        Promise.all([
          queryInterface.bulkInsert(
            "ChantierCamionneur",
            ChantierCamionneur
          ),
          queryInterface.bulkInsert("LieuGrutier", LieuGrutier),
        ])
      ).catch(err => console.log(err))
  },
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
