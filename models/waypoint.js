const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
  class Waypoint extends Model {}
  Waypoint.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
    },
    { sequelize, modelName: "Waypoint" }
  );
  return Waypoint;
};