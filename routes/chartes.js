const router = require("express").Router();
const sequelize = require("../models").sequelize;
const Charte = sequelize.model("Charte")

router.get("/", async (req, res, next) => {
    try {
        const text = (await Charte.findAll({ limit: 1 }))[0].text;
        res.json({ text: text });
    } catch (error) {
        next(error);
    }

});

router.patch("/", async (req, res, next) => {
    try {
        const { text } = req.body;
        const { id } = (await Charte.findAll({ limit: 1 }))[0];
        await Charte.update({ text: text }, { where: { id } });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }

});

module.exports = router;