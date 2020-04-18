const router = require('express').Router()
const Lieu = require('../models').sequelize.model('Lieu')

router.get('/', async (req, res, next) => {
    try {
        res.json(await Lieu.findAll())
    } catch (error) {
        next(error)
    }
})

router.post("/", async (req, res, next) => {
    try {
      const { adresse, longitude, latitude } = req.body;
      if (!(adresse && longitude && latitude)) {
        const error = new Error("Bad request");
        error.status = 400;
        next(error);
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