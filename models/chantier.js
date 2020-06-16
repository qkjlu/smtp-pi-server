const uuid = require("uuid").v4;
const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
  class Chantier extends Model {}
  Chantier.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: "Chantier"  }
  );
  Chantier.associate = (models) => {
    Chantier.belongsToMany(models.Camionneur, {
      through: "ChantierCamionneur",
    });
    Chantier.belongsTo(models.Lieu, {
      as: "lieuDéchargement",
      foreignKey: { allowNull: false },
    });
    Chantier.belongsTo(models.Lieu, {
      as: "lieuChargement",
      foreignKey: { allowNull: false },
    });
    Chantier.hasMany(models.Etape);
    Chantier.hasOne(models.Route, {
      as: "routeChantierToDécharge"
    })
    Chantier.hasOne(models.Route, {
      as: "routeDéchargeToChantier"
    })
  };
  return Chantier;
};
