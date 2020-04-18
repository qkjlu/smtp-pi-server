const Model = require("sequelize").Model;
const uuid = require("uuid").v4;
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {}
  Admin.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      nom: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      prenom: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      mail: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      password: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
    },
    { sequelize, modelName: "Admin" }
  );
  Admin.beforeCreate((admin) => (admin.id = uuid()));
  return Admin;
};
