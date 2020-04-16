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
  try {
    await sequelize.sync({ force: true });
    await Promise.all([
      ...mockData.Lieux.map((lieu) => LieuModel.create(lieu)),
      ...mockData.Camionneurs.map((camionneur) =>
        CamionneurModel.create(camionneur)
      ),
      ...mockData.Admins.map((admin) => AdminModel.create(admin)),
      ...mockData.Grutiers.map((grutier) => GrutierModel.create(grutier)),
    ]);
    await Promise.all(
      mockData.Chantiers.map((chantier) => ChantierModel.create(chantier))
    );
    await Promise.all(mockData.Etapes.map((etape) => EtapeModel.create(etape)));
    res.json(
      "La base de donnée a été créé et les mock-data ont été insérées avec succès"
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({error});
  }
});

module.exports = router;
