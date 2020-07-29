const uuid = require('uuid').v4
const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
  class Pause extends Model {}
  Pause.init(
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
        type: DataTypes.DATE,
        allowNull: true,
      }
    },
    { sequelize, modelName: "Pause"  }
  );
  Pause.associate = models => {
    Pause.belongsTo(models.Etape, { foreignKey: { allowNull: false } });
  }
  return Pause;
};
