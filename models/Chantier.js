const Model = require("sequelize").Model;
module.exports = (sequelize, DataTypes) => {
  class Chantier extends Model {}
  Chantier.init(
    {
      nom: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
    },
    { sequelize }
  );
  return Chantier;
};
