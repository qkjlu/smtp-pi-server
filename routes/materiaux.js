const router = require("express").Router();
const Materiau = require("../models").sequelize.model("Materiau");

router.post("/", async (req, res, next) => {
    const { nom } = req.body;
    if (!nom) {
        res.sendStatus(400);
    }
    try {
        const materiau = await Materiau.create({
            nom
        });
        res.status(201).json(materiau);
    } catch (error) {
        next(error);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const materiaux = await Materiau.findAll();
        res.status(200).json(materiaux);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        await Materiau.destroy({where : { id }});
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
})

module.exports = router;