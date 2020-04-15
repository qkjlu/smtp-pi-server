const Model = require("sequelize").Model;
module.exports = (sequelize, DataTypes) => {
  class Lieu extends Model {}
  Lieu.init(
    {
      adresse: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      sequelize,
      name: {
        singular: "Lieu",
        plural: "Lieux",
      },
      tableName: "Lieux",
    }
  );
  return Lieu;
};
