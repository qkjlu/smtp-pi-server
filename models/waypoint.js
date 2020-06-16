const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
    class Waypoint extends Model { }
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
    Waypoint.associate = (models) => {
        Waypoint.hasOne(models.Route, {
            as: "origin"
        });
        Waypoint.hasOne(models.Route, {
            as: "destination"
        });
        Waypoint.belongsTo(models.Route);
    };
    return Waypoint;
};