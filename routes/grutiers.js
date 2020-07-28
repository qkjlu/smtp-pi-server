const router = require("express").Router();
const sequelize = require("../models").sequelize;
const Grutier = sequelize.model("Grutier");
const OperationCarburant = sequelize.model("OperationCarburant");
const Entreprise = sequelize.model("Entreprise");
const Lieu = sequelize.model("Lieu");
var _ = require("lodash");
var jwt = require("jsonwebtoken");
const helper = require("./helpers/helper");
const {
  personnelValidationRules,
  personnelValidate,
  updatePersonnelRules,
  deleteRules,
  validate,
} = require("./helpers/validator");
const e = require("express");

router.get("/", async (req, res, next) => {
  try {
    res.json(
      await Grutier.findAll({
        include: {
          model: Entreprise,
        },
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  helper.getById(Grutier, req, res, next, {
    include: {
      model: Entreprise,
    },
  });
});

router.get("/:id/entreprises", async (req, res, next) => {
  helper.getAssociatedById(Grutier, Entreprise, req, res, next);
});

router.get("/:id/carburant/:date", async (req, res, next) => {
  try {
    const { id, date } = req.params;
    const dateObj = new Date(Number(date));
    const grutier = await Grutier.findByPk(id);
    const operationCarburants = await grutier.getOperationCarburants();
    const byDate = operationCarburants.filter(e => {
      const createdAt = e.createdAt;
      return ( 
        dateObj.getDate() === createdAt.getDate()
        && dateObj.getMonth() === createdAt.getMonth()
        && dateObj.getFullYear() == createdAt.getFullYear()
        )
    })
    res.json(byDate);
  } catch (error) {
    next(error)
  }
  
});

router.put("/:id/carburant", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { volume, type } = req.body;
    const grutier = await Grutier.findByPk(id);
    const existingOperationCarburant = await grutier.getOperationCarburants();

    // Create if the operation doesn't exist, update if not
    const existingOperation = existingOperationCarburant.find( e => e.type === type);
    if(existingOperation !== undefined){
      await OperationCarburant.upsert({
        id: existingOperation.id,
        type, 
        volume
      })
    } else {
      const operationCarburant = await OperationCarburant.create({
        type, 
        volume
      })
      await operationCarburant.setGrutier(grutier);
    }
    // ------------------

    res.sendStatus(200);
  } catch (error) {
    next(error)
  }
});

router.post(
  "/",
  personnelValidationRules(),
  personnelValidate,
  async (req, res, next) => {
    try {
      const { nom, prenom, entreprise } = req.body;
      const newGrutier = await Grutier.create({ nom, prenom });
      await newGrutier.addEntreprise(entreprise);
      res.status(201).json(newGrutier);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/:id/lieu", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lieu } = req.body;
    if (!lieu) {
      res.sendStatus(400);
    }
    const grutierToAddLieu = await Grutier.findByPk(id, {
      include: {
        model: Lieu,
      },
    });
    const lieuxGrutierId = grutierToAddLieu.map((g) => g.id);
    if (_.indexOf(lieuxGrutierId, lieu) != -1) {
      res.sendStatus(409);
    } else {
      res.status(201).json(await grutierToAddLieu.addLieu(lieu));
    }
  } catch (error) {
    next(error);
  }
});

router.post("/:id/entreprise", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { entreprise } = req.body;
    if (!entreprise) {
      res.sendStatus(400);
    }
    const grutierToAddEntreprise = await Grutier.findByPk(id, {
      include: {
        model: Entreprise,
      },
    });
    const entreprisesGrutierId = grutierToAddEntreprise
      .get("Entreprises")
      .map((ets) => ets.id);
    if (_.indexOf(entreprisesGrutierId, entreprise) != -1) {
      res.sendStatus(409);
    } else {
      res
        .status(201)
        .json(await grutierToAddEntreprise.addEntreprise(entreprise));
    }
  } catch (error) {
    next(error);
  }
});

router.post("/authenticate", async (req, res, next) => {
  try {
    const { nom, prenom, entreprise } = req.body;
    if (!(nom && prenom && entreprise)) {
      res.sendStatus(400);
    }
    const grutierToConnect = await Grutier.findOne({
      where: { nom, prenom },
      include: [
        {
          model: Entreprise,
          where: { id: entreprise },
          attributes: ["id", "nom"],
          logging: true,
        },
      ],
    });
    _.isEmpty(grutierToConnect)
      ? res.sendStatus(403)
      : res.json({
          token: jwt.sign(
            { id: grutierToConnect.id, role: "grutier" },
            process.env.JWT_SECRET
          ),
        });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:id",
  updatePersonnelRules("Grutier"),
  validate,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nom, prenom } = req.body;
      await Grutier.update({ nom, prenom }, { where: { id } });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/", deleteRules("Grutier"), validate, async (req, res, next) => {
  try {
    const { id } = req.body;
    res.status(204).json(await Grutier.destroy({ where: { id: id } }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
