const router = require("express").Router();
const sequelize = require("../models").sequelize;
const mockData = require("../models").MockData;
const EtapeModel = require("../models").Etape;
const ChantierModel = require("../models").Chantier;
const CamionneurModel = require("../models").Camionneur;
const LieuModel = require("../models").Lieu;
const AdminModel = require("../models").Admin;
const GrutierModel = require("../models").Grutier;

router.get("/init", async (req, res) => {
  await sequelize.sync({ force: true });
  await Promise.all([
    ...mockData.Lieux.map((lieu) => LieuModel.create(lieu)),
    ...mockData.Camionneurs.map((camionneur) =>
      CamionneurModel.create(camionneur)
    ),
    ...mockData.Admins.map((admin) => AdminModel.create(admin)),
    ...mockData.Grutiers.map((grutier) => GrutierModel.create(grutier)),
  ]).catch((err) => {
    console.error(err);
  });
  await Promise.all(
    mockData.Chantiers.map((chantier) => ChantierModel.create(chantier))
  ).catch((err) => {
    console.error(err);
  });
  await Promise.all(
    mockData.Etapes.map((etape) => EtapeModel.create(etape))
  ).catch((err) => {
    console.error(err);
  });
  res.json(
    "La base de donnée a été créé et les mock-data ont été insérées avec succès"
  );
});

module.exports = router;
