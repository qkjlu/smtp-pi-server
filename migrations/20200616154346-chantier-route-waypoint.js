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
      await queryInterface.createTable("Routes", {
        id: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.DataTypes.UUIDV4
        }
      }, { transaction });
      await queryInterface.createTable("Waypoints", {
        id: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.DataTypes.UUIDV4
        },
        longitude: {
          type: Sequelize.DataTypes.DOUBLE,
          allowNull: false,
        },
        latitude: {
          type: Sequelize.DataTypes.DOUBLE,
          allowNull: false,
        }
      }, { transaction });
      await queryInterface.addColumn("Waypoints", "waypointOfRouteId", Sequelize.DataTypes.UUID, { transaction });
      await queryInterface.addConstraint("Waypoints", {
        type: "FOREIGN KEY",
        name: "FK_ROUTE",
        fields: ["waypointOfRouteId"],
        references: {
          table: "Routes",
          field: "id"
        },
        transaction
      });
      await queryInterface.addColumn("Routes", "originId", Sequelize.DataTypes.UUID, { transaction });
      await queryInterface.addColumn("Routes", "destinationId", Sequelize.DataTypes.UUID, { transaction });
      await queryInterface.addConstraint("Routes", {
        type: "FOREIGN KEY",
        name: "FK_WAYPOINT_ORIGIN",
        fields: ["originId"],
        references: {
          table: "Waypoints",
          field: "id"
        }, 
        transaction
      });
      await queryInterface.addConstraint("Routes", {
        type: "FOREIGN KEY",
        name: "FK_WAYPOINT_DESTINATION",
        fields: ["destinationId"],
        references: {
          table: "Waypoints",
          field: "id"
        }, 
        transaction
      });
      await queryInterface.addColumn("Chantiers", "allerId", Sequelize.DataTypes.UUID, { transaction });
      await queryInterface.addColumn("Chantiers", "retourId", Sequelize.DataTypes.UUID, { transaction });
      await queryInterface.addConstraint("Chantiers", {
        type: "FOREIGN KEY",
        name: "FK_ROUTE_ALLER",
        fields: ["allerId"],
        references: {
          table: "Routes",
          field: "id"
        },
        transaction
      });
      await queryInterface.addConstraint("Chantiers", {
        type: "FOREIGN KEY",
        name: "FK_ROUTE_RETOUR",
        fields: ["retourId"],
        references: {
          table: "Routes",
          field: "id"
        },
        transaction
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
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
      await queryInterface.removeConstraint("Chantiers", "FK_ROUTE", { transaction });
      await queryInterface.removeConstraint("Routes", "FK_WAYPOINT", { transaction });
      await queryInterface.removeConstraint("Waypoints", "FK_ROUTE", { transaction });
      await queryInterface.removeColumn("Chantiers", "allerId", { transaction });
      await queryInterface.removeColumn("Chantiers", "retourId", { transaction });
      await queryInterface.dropTable("Waypoints", { transaction });
      await queryInterface.dropTable("Routes", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
   
  }
};
