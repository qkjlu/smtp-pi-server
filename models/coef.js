const uuid = require("uuid").v4;
const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
  class Coef extends Model {}
  Coef.init(
    {
      value: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    { sequelize, modelName: "Coef" }
  );
  Coef.associate = (models) => {
    
  };
  return Coef;
};
