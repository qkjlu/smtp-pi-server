const Model = require('sequelize').Model;
module.exports = (sequelize, DataTypes) => {
    class Camionneur extends Model {}
    Camionneur.init(
      {
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
    return Camionneur;
  };