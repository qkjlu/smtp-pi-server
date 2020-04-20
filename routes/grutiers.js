const router = require("express").Router();
const sequelize = require("../models").sequelize;
const Grutier = sequelize.model("Grutier");
const Entreprise = sequelize.model("Entreprise");
var _ = require("lodash");
var jwt = require("jsonwebtoken");

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

router.post("/", async (req, res, next) => {
  try {
    const { nom, prenom, entreprise } = req.body;
    if (!(nom && prenom && entreprise)) {
      res.sendStatus(400);
    }
    const newGrutier = await Grutier.create({ nom, prenom });
    await newGrutier.addEntreprise(entreprise);
    res.status(201).json(newGrutier);
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

module.exports = router;
