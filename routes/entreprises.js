const router = require('express').Router()
const Entreprise = require('../models').sequelize.model('Entreprise')

router.get("/", async (req, res) => {
    try {
        res.json(await Entreprise.findAll())
    } catch (error) {
        next(error)
    }
});

router.post("/", async (req, res, next) => {
  try {
    const { nom } = req.body;
    if (!(nom && prenom)) {
      const error = new Error("Bad request");
      error.status = 400;
      next(error);
    }
    res.status(201).json(
      await Entreprise.create({ nom })
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router