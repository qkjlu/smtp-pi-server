const uuid = require('uuid').v4
const Model = require('sequelize').Model;
module.exports = (sequelize, DataTypes) => {
    class Camionneur extends Model {}
    Camionneur.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.UUID
        },
        nom: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
        prenom: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
      },
      { sequelize }
    );
    Camionneur.beforeCreate( camionneur => camionneur.id = uuid())
    return Camionneur;
  };