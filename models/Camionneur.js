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
      { sequelize, modelName: "Camionneur"  }
    );
    Camionneur.beforeCreate( camionneur => camionneur.id = uuid())
    Camionneur.associate = models => {
      Camionneur.hasMany(models.Etape, { foreignKey: { allowNull: false } });
      Camionneur.belongsToMany(models.Chantier, { through: "ChantierCamionneur" });
      Camionneur.belongsToMany(models.Entreprise, { through: "EntrepriseCamionneur", foreignKey : { allowNull: false } });
    }
    return Camionneur;
  };