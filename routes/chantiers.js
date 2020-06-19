const router = require("express").Router();
const sequelize = require("../models").sequelize;
const Chantier = require("../models").sequelize.model("Chantier");
const { updateChantierRules, deleteRules, validate } = require("./helpers/validator");
const { createLogger } = require("winston");
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

router.put("/:id/route/:type", async (req, res, next) => {
  try {
    const { id, type } = req.params;
    const { waypoints } = req.body;
    const chantier = await Chantier.findByPk(id);
    const route = await sequelize.model("Route").create();
    if(type == "aller") chantier.setAller(route);
    else if (type == "retour") chantier.setRetour(route);
    waypoints.map(async w => {
      const createdWaypoint = await sequelize.model("Waypoint").create({ longitude: w.longitude, latitude: w.latitude, ordre: w.ordre });
      await createdWaypoint.setRoute(route);
    });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }

});

router.delete("/", deleteRules("Chantier"), validate, async (req, res, next) => {
  try {
    const { id } = req.body;
    res.status(204).json(await Chantier.destroy({ where: { id: id } }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
