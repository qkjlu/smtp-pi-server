const uuid = require('uuid').v4
const Model = require('sequelize').Model;
module.exports = (sequelize, DataTypes) => {
    class Camionneur extends Model {}
    Camionneur.init(
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
        },
      },
      { sequelize, modelName: "Camionneur"  }
    );
    Camionneur.associate = models => {
      Camionneur.hasMany(models.Etape, { foreignKey: { allowNull: false } });
      Camionneur.belongsToMany(models.Chantier, { through: "ChantierCamionneur" });
      Camionneur.belongsToMany(models.Entreprise, { through: "EntrepriseCamionneur"});
    }
    return Camionneur;
  };