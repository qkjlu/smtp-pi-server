const router = require("express").Router();
const Grutier = require("../models").sequelize.model("Grutier");

router.get("/", async (req, res, next) => {
  try {
    res.json(await Grutier.findAll());
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
    await newGrutier.addEntreprise(entreprise)
    res.status(201).json(newGrutier);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
