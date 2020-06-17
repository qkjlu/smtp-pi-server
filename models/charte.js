const Model = require("sequelize").Model;

module.exports = (sequelize, DataTypes) => {
  class Charte extends Model {}
  Charte.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },

      text: {
          type: DataTypes.TEXT
      }
    },
    { sequelize, modelName: "Charte" }
  );
  return Charte;
};