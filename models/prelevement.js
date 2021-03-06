const uuid = require('uuid').v4
const Model = require('sequelize').Model; 

module.exports = (sequelize, DataTypes) => {
    class Prelevement extends Model {}
    Prelevement.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4
        },
        quantite: {
          type: DataTypes.FLOAT,
          allowNull: false,
        }
      },
      { sequelize, modelName: "Prelevement" }
    );
    Prelevement.associate = models => {
      Prelevement.belongsTo(models.Lieu, { as: "lieuChargement" });
      Prelevement.belongsTo(models.Lieu, { as: "lieuDéchargement" });
      Prelevement.belongsTo(models.Materiau);
      Prelevement.belongsTo(models.Camionneur);
    }
    return Prelevement;
  };
