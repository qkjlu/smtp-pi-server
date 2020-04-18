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
      { sequelize, modelName: "Grutier"  }
    );
    Grutier.beforeCreate( grutier => grutier.id = uuid())
    Grutier.associate = models => {
      Grutier.belongsToMany(models.Lieu, { through: "LieuGrutier" });
      Grutier.belongsToMany(models.Entreprise, { through: "EntrepriseGrutier", allowNull : false })
    }
    return Grutier;
  };
