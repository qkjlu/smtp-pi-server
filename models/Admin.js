const Model = require('sequelize').Model;
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {}
  Admin.init(
    {
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
    { sequelize }
  );
  return Admin;
};
