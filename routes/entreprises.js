const router = require("express").Router();
const Entreprise = require("../models").sequelize.model("Entreprise");
var _ = require("lodash");
const helper = require("../routes/helpers/helper")

router.get("/", async (req, res, next) => {
  try {
    res.json(await Entreprise.findAll());
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  helper.getById(Entreprise, req, res, next);
  // try {
  //   const { id } = req.params;
  //   const entrepriseToFind = await Entreprise.findByPk(id);
  //   if (_.isEmpty(entrepriseToFind)) {
  //     res.sendStatus(204);
  //   } else {
  //     res.json(entrepriseToFind);
  //   }
  // } catch (error) {
  //   next(error);
  // }
})

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
