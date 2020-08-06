const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
    class Sortie extends Model {}
    Sortie.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            dateDebut: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            type:{
                type: DataTypes.TEXT,
                allowNull: false,
            },
            dateFin: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        { sequelize, modelName: "Sortie" }
    );

    Sortie.associate = models => {
        Sortie.belongsTo(models.Camionneur, { foreignKey: { allowNull: true } })
        Sortie.belongsTo(models.Chantier, { foreignKey: { allowNull: true } });
        Sortie.hasMany(models.Waypoint)
    }
    return Sortie;
};