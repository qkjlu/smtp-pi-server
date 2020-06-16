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
    Route.belongsTo(models.Waypoint, {
        as: "origin"
    });
    Route.belongsTo(models.Waypoint, {
        as: "destination"
    });
    Route.hasMany(models.Waypoint, {
        as: "waypoints"
    });
    
  };
  return Route;
};