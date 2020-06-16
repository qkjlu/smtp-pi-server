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
    Route.hasOne(models.Waypoint, {
        as: "origin"
    });
    Route.hasOne(models.Waypoint, {
        as: "destination"
    });
    Route.hasMany(model.Waypoint, {
        as: "waypoints"
    });
    
  };
  return Route;
};