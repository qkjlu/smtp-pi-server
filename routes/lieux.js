const router = require("express").Router();
const Lieu = require("../models").sequelize.model("Lieu");
const { Op } = require("sequelize");
const { getByIdRules, getByIdValidate } = require("./helpers/validator");

router.get("/", async (req, res, next) => {
  try {
    res.json(await Lieu.findAll());
  } catch (error) {
    next(error);
  }
});

router.get("/carrieres", async (req, res, next) => {
  try {
    const carrieres = await Lieu.findAll({
      where : { 
        type: { 
          [Op.eq]: "carriere"
        } 
      } 
    });
    res.json(carrieres);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const lieuToFind = await Lieu.findByPk(id);
    res.json(lieuToFind);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { adresse, longitude, latitude, rayon, type } = req.body;
    if (!(adresse && longitude && latitude)) {
      res.sendStatus(400);
    }
    res.status(201).json(
      await Lieu.create({
        adresse,
        longitude,
        latitude,
        rayon, 
        type
      })
    );
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const { adresse, longitude, latitude, rayon, type } = req.body;
  const { id } = req.params;
  if(!(adresse && longitude && latitude && rayon)){
    res.sendStatus(400)
  }
  try {
    await Lieu.update({ adresse, longitude, latitude, rayon, type }, { where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await Lieu.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
