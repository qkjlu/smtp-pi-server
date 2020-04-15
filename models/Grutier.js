const Model = require('sequelize').Model;
module.exports = (sequelize, DataTypes) => {
    class Grutier extends Model {}
    Grutier.init(
      {
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
    return Grutier;
  };
