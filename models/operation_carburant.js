const uuid = require('uuid').v4
const Model = require('sequelize').Model;

module.exports = (sequelize, DataTypes) => {
    class OperationCarburant extends Model {}
    OperationCarburant.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        volume: {
          type: DataTypes.FLOAT,
          allowNull: false,
        }
      },
      { sequelize, modelName: "OperationCarburant"  }
    );
    OperationCarburant.associate = models => {
        OperationCarburant.belongsTo(models.Grutier);
    }
    return OperationCarburant;
  };
