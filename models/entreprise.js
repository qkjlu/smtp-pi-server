"use strict";
module.exports = (sequelize, DataTypes) => {
  const Entreprise = sequelize.define(
    "Entreprise",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      nom: { type: DataTypes.STRING, allowNull: false },
    },
    {}
  );
  Entreprise.associate = models => {
    Entreprise.belongsToMany(models.Grutier, { through: "EntrepriseGrutier" });
    Entreprise.belongsToMany(models.Camionneur, { through: "EntrepriseCamionneur" });
  }
  return Entreprise;
};
