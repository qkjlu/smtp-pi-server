const uuid = require('uuid').v4
const Model = require("sequelize").Model;
module.exports = (sequelize, DataTypes) => {
  class Lieu extends Model {}
  Lieu.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      adresse: {
        type: DataTypes.STRING,
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
      rayon: {
        type: DataTypes.INTEGER,
        //allowNull: false
      }
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
  Lieu.associate = models => {
    Lieu.belongsToMany(models.Grutier, { through: "LieuGrutier" });
    Lieu.hasMany(models.Chantier);

  }
  return Lieu;
};
