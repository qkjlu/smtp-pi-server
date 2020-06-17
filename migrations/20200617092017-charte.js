'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   const transaction = await queryInterface.sequelize.transaction();
   try {
     await queryInterface.createTable("Chartes", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      text: {
          type: Sequelize.DataTypes.TEXT
      }
    }, { transaction });
    await transaction.commit();
   } catch (error) {
    await transaction.rollback();
    throw error;
   }
  },

  async down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable("Chartes", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
