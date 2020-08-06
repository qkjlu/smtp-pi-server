const router = require("express").Router();
const sequelize = require("../models").sequelize;
const Chantier = require("../models").sequelize.model("Chantier");
const Route = require("../models").sequelize.model("Route");
const JourSemaine = require("../models").sequelize.model("JourSemaine");
const Coef = require("../models").sequelize.model("Coef");

const _ = require("lodash");
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

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    res.json(
      await Chantier.findByPk(id,
        {
          include:
            [{
              model: sequelize.model("Lieu"),
              as: "lieuDéchargement"
            },
            {
              model: sequelize.model("Lieu"),
              as: "lieuChargement"
            }]
        })
    );
  } catch (error) {
    next(error)
  }
});

router.put("/:id/route/:type", async (req, res, next) => {
  try {
    const { id, type } = req.params;
    const { waypoints } = req.body;
    const chantier = await Chantier.findByPk(id, { include : { model: Route, as: type }});
    let route = chantier[type];
    
    if(_.isNull(route)){
      route = await sequelize.model("Route").create();
      const jours = await JourSemaine.findAll();
      jours.forEach(jour => {
        Coef.create({ RouteId: route.id, JourSemaineId: jour.id, value: 1.25 });
      });
    } else {
      const previousWaypoints = await route.getWaypoints();
      previousWaypoints.forEach(pw => pw.destroy());
    }

    if (type == "aller") chantier.setAller(route);
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

router.patch("/:id/route/:type/coefs", async (req, res, next) => {
  try {
    const { id, type } = req.params;
    const { day, value } = req.body;
    const chantier = await Chantier.findByPk(id, { include : type});
    const jour = await JourSemaine.findOne({ where : { nom: day }});
    const route = chantier[type];
    const result = await Coef.update({value}, {where : { RouteId: route.id, JourSemaineId: jour.id }});
    res.sendStatus(200);
  } catch (error) {
    next(error)
  }
});

router.get("/:id/route/:type/coefs", async (req, res, next) => {
  try {
    const { id, type } = req.params;
    const chantier = await Chantier.findByPk(id,{ 
      include : {
        model: Route, 
        as: type,
        include : {
          model: JourSemaine
        }
      }
    });
    res.json(chantier)
  } catch (error) {
    next(error)
  }
});

router.get("/:id/route/:type", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.params;
    const chantier = await Chantier.findByPk(id, { include : type});
    let route = null;
    if (type == "aller") route = await chantier.getAller();
    else if (type == "retour") route = await chantier.getRetour();

    if (_.isNull(route)) {
      res.sendStatus(404);
      return;
    }

    const waypoints = await route.getWaypoints();
    if (_.isEmpty(waypoints)) {
      res.sendStatus(404);
      return;
    } else {
      res.json(waypoints);
    }
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
