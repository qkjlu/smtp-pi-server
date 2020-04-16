const uuid = require('uuid').v4
const Model = require('sequelize').Model;

module.exports = (sequelize, DataTypes) => {
    class Grutier extends Model {}
    Grutier.init(
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
        }
      },
      { sequelize }
    );
    Grutier.beforeCreate( grutier => grutier.id = uuid())
    return Grutier;
  };
