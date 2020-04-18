const uuid = require('uuid').v4
const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
  class Etape extends Model {}
  Etape.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      dateDebut: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateFin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['chargement', 'déchargement', 'pause', 'panne']]
        }
      },
      tempsManoeuvre: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, modelName: "Etape"  }
  );
  Etape.associate = models => {
    Etape.belongsTo(models.Camionneur, { foreignKey: { allowNull: false } })
    Etape.belongsTo(models.Chantier, { foreignKey: { allowNull: false } });
  }
  return Etape;
};
