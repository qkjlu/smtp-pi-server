const router = require("express").Router();
const Chantier = require("../models").sequelize.model("Chantier");
const { updateChantierRules, deleteRules, validate } = require("./helpers/validator");
router.get("/", async (req, res, next) => {
  try {
    res.json(await Chantier.findAll());
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { nom, lieuChargementId, lieuDéchargementId } = req.body;
    if (!(nom && lieuChargementId && lieuDéchargementId)) {
      res.sendStatus(400);
    }
    res.status(201).json(
      await Chantier.create({
        nom,
        lieuDéchargementId,
        lieuChargementId,
      })
    );
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:id",
  updateChantierRules(),
  validate,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nom, lieu } = req.body;
      await Chantier.update({ nom, lieu }, { where: { id } });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/", deleteRules("Chantier"), validate, async (req, res, next) => {
  try {
    const { id } = req.body;
    res.status(204).json(await Chantier.destroy({ where: { id: id } }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
