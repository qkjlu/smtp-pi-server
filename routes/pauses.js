const router = require("express").Router();
const { Op } = require("sequelize");
const Etape = require("../models").sequelize.model('Etape');
const Pause = require("../models").sequelize.model('Pause');

router.get("/", async (req, res, next) => {
    try {
        res.json(await Pause.findAll());
    } catch (error) {
        next(error)
    }
});

router.get("/:id", async (req, res, next) =>{
    const { id } = req.params;
    try {
        res.json(await Pause.findAll({where: { id } }));
    } catch (error) {
        next(error)
    }
});

router.get("/etapes/:EtapeId", async (req, res, next) =>{
    const { EtapeId } = req.params;
    try {
        res.json(await Pause.findAll({where : {EtapeId, [Op.not] : {dateFin : null}}}));
    } catch (error) {
        next(error)
    }
});

router.post("/", async (req, res, next) => {
  const { id, dateDebut, EtapeId} = req.body;
  if (!(dateDebut && id && EtapeId)) {
    res.sendStatus(400);
  }
  try {
    res.status(201).json(
      await Pause.create({
        id,
        dateDebut,
        EtapeId
      })
    );
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const { dateFin } = req.body;
  const { id } = req.params;
  try {
    await Etape.update({ dateFin }, { where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
