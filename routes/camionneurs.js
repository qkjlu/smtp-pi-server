const router = require('express').Router()
const sequelize = require('../models').sequelize;
const Camionneur = sequelize.model('Camionneur')

router.get("/", async (req, res, next) => {
    try {
        res.json(await Camionneur.findAll())
    } catch (error) {
        next(error)
    }
});

router.post("/", async (req, res, next) => {
  try {
    const { nom, prenom, entreprise } = req.body;
    if (!(nom && prenom && entreprise)) {
      res.sendStatus(400)
    }
    const newCamionneur = await Camionneur.create({ nom, prenom });
    await newCamionneur.addEntreprise(entreprise)
    res.status(201).json(newCamionneur);
  } catch (error) {
    next(error);
  }
});


module.exports = router