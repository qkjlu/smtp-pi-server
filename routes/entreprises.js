const router = require("express").Router();
const Entreprise = require("../models").sequelize.model("Entreprise");

router.get("/", async (req, res, next) => {
  try {
    res.json(await Entreprise.findAll());
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { nom } = req.body;
    if (!nom) {
      res.sendStatus(400)
    }
    res.status(201).json(await Entreprise.create({ nom }));
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.sendStatus(400)
    }
    const resultDelete = await Entreprise.destroy({ where: { id: id } });
    if(resultDelete > 0) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
