const router = require("express").Router();
const Models = require("../models");

router.get("/", async (req, res) => {
    try {
        res.json(await Models.Chantier.findAll())
    } catch (error) {
        next(error)
    }
});

router.post("/", async (req, res, next) => {
  try {
    const { nom, lieuChargementId, lieuDéchargementId } = req.body;
    if (!(nom && lieuChargementId && lieuDéchargementId)) {
      const error = new Error("Bad request");
      error.status = 400;
      next(error);
    }
    res.status(201).json(
      await Models.Chantier.create({
        nom,
        lieuDéchargementId,
        lieuChargementId,
      })
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
