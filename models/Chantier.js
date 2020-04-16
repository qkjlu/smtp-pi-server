const uuid = require('uuid').v4
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
    { sequelize }
  );
  Chantier.beforeCreate( chantier => chantier.id = uuid())
  return Chantier;
};
