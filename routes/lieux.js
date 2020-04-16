const router = require('express').Router()
const Models = require('../models')

router.get('/', async (req, res, next) => {
    try {
        res.json(await Models.Lieu.findAll())
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
        await Models.Lieu.create({
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