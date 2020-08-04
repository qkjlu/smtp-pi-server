'use strict';
const s = require("../models").sequelize;

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const jours = await s.model("JourSemaine").findAll();
      const routes = await s.model("Route").findAll();
      jours.forEach(j => {
        routes.forEach(async r => {
          const res = await queryInterface.bulkInsert("Coefs", [{
            RouteId: r.id, JourSemaineId: j.id, value: 1.25,
            createdAt: new Date(),
            updatedAt: new Date()
          }]);
        });
      });
    } catch (err) {
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
