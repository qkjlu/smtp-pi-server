const uuid = require('uuid').v4
const Model = require('sequelize').Model;

module.exports = (sequelize, DataTypes) => {
    class Grutier extends Model {}
    Grutier.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4
        },
        nom: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        prenom: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      },
      { sequelize, modelName: "Grutier"  }
    );
    Grutier.associate = models => {
      Grutier.belongsToMany(models.Lieu, { through: "LieuGrutier" });
      Grutier.belongsToMany(models.Entreprise, { through: "EntrepriseGrutier", allowNull : false })
      Grutier.hasMany(models.OperationCarburant);
    }
    return Grutier;
  };
