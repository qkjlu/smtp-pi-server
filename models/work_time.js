const uuid = require('uuid').v4
const Model = require('sequelize').Model; 

module.exports = (sequelize, DataTypes) => {
    class WorkTime extends Model {}
    WorkTime.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4
        },
        hour: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        minute: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      { sequelize, modelName: "WorkTime"  }
    );
    WorkTime.associate = models => {
      WorkTime.belongsTo(models.Grutier);
    }
    return WorkTime;
  };
