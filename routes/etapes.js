const router = require("express").Router();
const Etape = require("../models").sequelize.model('Etape');

router.get("/", async (req, res, next) => {
    try {
        res.json(await Etape.findAll());
    } catch (error) {
        next(error)
    }
  
});

router.post("/", async (req, res, next) => {
  const { dateDebut, type, CamionneurId, ChantierId } = req.body;
  if (!(dateDebut && type && CamionneurId && ChantierId)) {
      const error = new Error("Bad request");
      error.status = 400;
      next(error);
  }
  try {
    res.status(201).json(
      await Etape.create({
        dateDebut,
        type,
        CamionneurId,
        ChantierId,
      })
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
