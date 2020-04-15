const Model = require("sequelize").Model;
module.exports = (sequelize, DataTypes) => {
  class Etape extends Model {}
  Etape.init(
    {
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
      },
      tempsManoeuvre: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize }
  );
  return Etape;
};
