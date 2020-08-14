const router = require("express").Router();
const { Op } = require("sequelize");
const Sortie = require("../models").sequelize.model('Sortie');
const Waypoint = require("../models").sequelize.model('Waypoint');

router.get("/", async (req, res, next) => {
    try {
        res.json(await Sortie.findAll());
    } catch (error) {
        next(error)
    }
});

router.post("/", async (req, res, next) => {
    const { id, dateDebut, type, CamionneurId, ChantierId , ouvert } = req.body;
    if (!( dateDebut && type && CamionneurId && ChantierId)) {
        res.sendStatus(400);
    }
    try {
        res.status(201).json(
            await Sortie.create({
                id,
                dateDebut,
                type,
                CamionneurId,
                ChantierId,
                ouvert,
            })
        );
    } catch (error) {
        next(error);
    }
});

router.post("/point",async (req, res, next) => {
    const { id, longitude, latitude, ordre, SortieId } = req.body;
    try {
        res.status(201).json(
            await Waypoint.create({
                longitude,
                latitude,
                ordre,
                SortieId,
                id,
            })
        );
    } catch (error) {
        next(error);
    }
});

router.get("/nouveaux", async (req, res, next) =>{
    try {
        res.json(await Sortie.count({where: { ouvert : 0 } }));
    } catch (error) {
        next(error)
    }
});

router.get("/:id", async (req, res, next) =>{
    const { id } = req.params;
    try {
        res.json(await Sortie.findAll({where: { id } }));
    } catch (error) {
        next(error)
    }
});

router.get("/:id/points", async (req, res, next) =>{
    const { id } = req.params;
    try {
        const sortie = await Sortie.findByPk(id);
        res.json( await sortie.getWaypoints());
    } catch (error) {
        next(error)
    }
});

router.patch("/:id", async (req, res, next) => {
    const { dateFin } = req.body;
    const { id } = req.params;
    try {
        await Sortie.update({ dateFin }, { where: { id } });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id",
    async (req, res, next) => {
        try {
            const { id } = req.params;
            res.status(204).json(await Sortie.destroy({ where: { id: id } }));
        } catch (error) {
            next(error);
        }
    }
);

router.delete("/",
    async (req, res, next) => {
        try {
            res.status(204).json(await Sortie.destroy({where : {}}));
        } catch (error) {
            next(error);
        }
    }
);

router.delete("/ouverts",
    async (req, res, next) => {
        try {
            res.status(204).json(await Sortie.destroy({where : {ouvert : true}}));
        } catch (error) {
            next(error);
        }
    }
);


module.exports = router;