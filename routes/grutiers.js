const router = require("express").Router();
const Models = require("../models");

router.get("/", async (req, res, next) => {
  try {
    res.json(await Models.Grutier.findAll());
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { nom, prenom } = req.body;
    if (!(nom && prenom)) {
      const error = new Error("Bad request");
      error.status = 400;
      next(error);
    }
    res.status(201).json(
      await Models.Grutier.create({
        nom,
        prenom,
      })
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
