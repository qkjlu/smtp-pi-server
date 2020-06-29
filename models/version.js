const Model = require("sequelize").Model;
const uuid = require("uuid").v4;
module.exports = (sequelize, DataTypes) => {
  class Version extends Model {}
  Version.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      numero: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: "Version" }
  );
  return Version;
};
