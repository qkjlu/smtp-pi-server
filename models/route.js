const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
  class Route extends Model {}
  Route.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
    },
    { sequelize, modelName: "Route"  }
  );
  Route.associate = (models) => {
    Route.hasOne(models.Chantier, {
        as: "aller"
    });
    Route.hasOne(models.Chantier, {
        as: "retour"
    });
    Route.hasMany(models.Waypoint);
    Route.belongsToMany(models.JourSemaine, { through: "Coef" });
  };
  return Route;
};