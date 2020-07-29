const uuid = require('uuid').v4
const Model = require('sequelize').Model; 

module.exports = (sequelize, DataTypes) => {
    class Materiau extends Model {}
    Materiau.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4
        },
        nom: {
          type: DataTypes.FLOAT,
          allowNull: false,
        }
      },
      { sequelize, modelName: "Materiau"  }
    );
    Materiau.associate = models => {
      
    }
    return Materiau;
  };
