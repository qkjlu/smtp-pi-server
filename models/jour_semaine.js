const uuid = require("uuid").v4;
const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
  class JourSemaine extends Model {}
  JourSemaine.init(
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
    { sequelize, modelName: "JourSemaine" }
  );
  JourSemaine.associate = (models) => {
    JourSemaine.belongsToMany(models.Route, { through: "Coef"});
  };
  return JourSemaine;
};
