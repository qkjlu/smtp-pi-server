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
            longitude: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            latitude: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            ordre: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        { sequelize, modelName: "Waypoint" }
    );
    Waypoint.associate = (models) => {
        Waypoint.belongsTo(models.Route);
        Waypoint.belongsTo(models.Sortie);
    };
    return Waypoint;
};