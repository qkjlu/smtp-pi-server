const uuid = require("uuid").v4;
const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
  class Chantier extends Model {}
  Chantier.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
    },
    { sequelize, modelName: "Chantier"  }
  );
  Chantier.beforeCreate((chantier) => (chantier.id = uuid()));
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
  };
  return Chantier;
};
