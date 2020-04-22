const router = require('express').Router()
const Lieu = require('../models').sequelize.model('Lieu')
const { getByIdRules, getByIdValidate } = require("./helpers/validator")

router.get('/', async (req, res, next) => {
    try {
        res.json(await Lieu.findAll())
    } catch (error) {
        next(error)
    }
})

router.get("/:id",  async (req, res, next) => {
  try {
    const { id } = req.params;
    const lieuToFind = await Lieu.findByPk(id);
    res.json(lieuToFind);
  } catch (error) {
    next(error);
  }
})

router.post("/", async (req, res, next) => {
    try {
      const { adresse, longitude, latitude } = req.body;
      if (!(adresse && longitude && latitude)) {
        res.sendStatus(400);
      }
      res.status(201).json(
        await Lieu.create({
          adresse,
          longitude,
          latitude
        })
      );
    } catch (error) {
      next(error);
    }
  });
module.exports = router