const router = require("express").Router();
const sequelize = require("../models").sequelize;
const Camionneur = sequelize.model("Camionneur");
const Entreprise = sequelize.model("Entreprise");
var _ = require("lodash");
var jwt = require("jsonwebtoken");

router.get("/", async (req, res, next) => {
  try {
    res.json(
      await Camionneur.findAll({
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
    const newCamionneur = await Camionneur.create({ nom, prenom });
    await newCamionneur.addEntreprise(entreprise);
    res.status(201).json(newCamionneur);
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
    const camionneurToConnect = await Camionneur.findOne({
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
    _.isEmpty(camionneurToConnect)
      ? res.sendStatus(403)
      : res.json({
          token: jwt.sign(
            { id: camionneurToConnect.id, role: "camionneur" },
            process.env.JWT_SECRET
          ),
        });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
