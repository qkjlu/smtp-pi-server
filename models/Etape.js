const uuid = require('uuid').v4
const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
  class Etape extends Model {}
  Etape.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID
      },
      dateDebut: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateFin: {
        type: DataTypes.CHAR,
        allowNull: true,
      },
      type: {
        type: DataTypes.CHAR,
        allowNull: false,
        validate: {
          isIn: [['chargement', 'déchargement', 'pause', 'panne']]
        }
      },
      tempsManoeuvre: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize }
  );
  Etape.beforeCreate( etape => etape.id = uuid())
  return Etape;
};
