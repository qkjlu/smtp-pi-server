


const router = require("express").Router();
const { Op } = require("sequelize");
const Etape = require("../models").sequelize.model('Etape');
const Camionneur = require("../models").sequelize.model("Camionneur");
const Chantier = require("../models").sequelize.model("Chantier");


router.get("/", async (req, res, next) => {
    try {
        res.json(await Etape.findAll());
    } catch (error) {
        next(error)
    }
  
});

router.post("/", async (req, res, next) => {
  const { id, dateDebut, type, CamionneurId, ChantierId, etapePrecId } = req.body;
  if (!(dateDebut && type && CamionneurId && ChantierId)) {
    res.sendStatus(400);
  }
  try {
    res.status(201).json(
      await Etape.create({
        id,
        dateDebut,
        type,
        CamionneurId,
        ChantierId,
        etapePrecId
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

router.get("/:id", async (req, res, next) => {
    const { id  } = req.params;
    try {
        const etape = await Etape.findByPk(id)
        res.json(etape);
    } catch (error) {
        next(error)
    }
});
/* ---- Statistics ---- */

function calculSumTimesEtapes(etapes) {
    let sum = 0;
    let invalidData = 0;
    for (let i = 0; i < etapes.length; i++) {
        console.log(etapes[i])
        let time = new Date(etapes[i].dateFin).getTime() - new Date(etapes[i].dateDebut).getTime()
        let secondes = Math.floor(time / 1000);
        if (secondes < 0) {
            console.log(" id a delete : " + etapes[i].id + " temps = " + secondes)
            invalidData++
        } else {
            console.log(secondes)
            sum += secondes
        }
    }
    return [sum, invalidData];
}

async function describeEtapes(etapes){
    for (let i = 0; i < etapes.length; i++) {
        console.log(etapes[i])
        etapes[i]({"camionneur" : await Camionneur.findByPk(etapes[i].CamionneurId)});
        //etapes[i]["chantier"] =  await Chantier.findByPk(etapes[i].ChantierId);
    }
    return etapes;
}

async function getEtapes(type, ChantierId, CamionneurId, date) {
    let etapes = null;
    if(date == null){
        if(CamionneurId == null){
            if(ChantierId == null){
                etapes = await Etape.findAll({where: { type } })
            }else{
                etapes = await Etape.findAll({where: { type , ChantierId } })
            }
        }else{
            etapes = await Etape.findAll({where: { type , ChantierId , CamionneurId } })
        }
        // date =/= null
    }else{
        if(CamionneurId == null){
            if(ChantierId == null) {
                etapes = await Etape.findAll({ where: { type, dateDebut: {[Op.gte]: date}, dateFin: {[Op.lte]: date} } })
            }else{
                etapes = await Etape.findAll({ where: { type, ChantierId, dateDebut: {[Op.gte]: date}, dateFin: {[Op.lte]: date} } })
            }
        }else{
            etapes = await Etape.findAll({ where: { type, ChantierId, CamionneurId, dateDebut: {[Op.gte]: date}, dateFin: {[Op.lte]: date} } })
        }
    }
    return etapes;
}

function getBestTime(etapes){
    let bestTime = -1
    let bestEtape = null
    for (let i = 0; i < etapes.length; i++) {
        let time = Math.floor((new Date(etapes[i].dateFin).getTime() - new Date(etapes[i].dateDebut).getTime())/1000);
        if (time > 0 && bestTime < 0 || (time > 0 && bestTime > time) ){
            bestTime = time
            bestEtape = etapes[i]
        }
    }
    return {
        bestTime : bestTime,
        bestEtape : bestEtape
    };
}

function getWorstTime(etapes){
    let worstTime = -1
    let worstEtape = null
    for (let i = 0; i < etapes.length; i++) {
        let time = Math.floor((new Date(etapes[i].dateFin).getTime() - new Date(etapes[i].dateDebut).getTime())/1000);
        if (time > 0 && worstTime < 0 || (time > 0 && worstTime < time) ){
            worstTime = time
            worstEtape = etapes[i]
        }
    }
    return {
        worstTime : worstTime,
        worstEtape : worstEtape
    };
}


function getNbTrucks(etapes){
    let nbChargement = 0
    let nbDechargement = 0
    for (let i = 0; i < etapes.length; i++) {
        if(etapes[i].type.equal("enChargement") && etapes[i].dateFin != null){
            nbChargement++
        }else{
            if(etapes[i].type.equal("enDéchargement") && etapes[i].dateFin != null){
                nbDechargement++
            }
        }
    }
    return {
        chargé : nbChargement,
        déchargé : nbChargement,
    };
}

router.get("/:type/average/chantiers/", async (req, res, next) => {
    const { type  } = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,null,null,date)
        console.log("etapes"+ etapes.length);
        let result = calculSumTimesEtapes(etapes);
        let sum = result[0]
        console.log("result"+ result[0]);
        let invalidData = result[1]
        let moyenne = Math.floor(sum/(etapes.length - invalidData));
        res.json({time : moyenne});
    } catch (error) {
        next(error)
    }
});

router.get("/:type/average/chantiers/:ChantierId/camionneurs", async (req, res, next) => {
    const { type , ChantierId  } = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,ChantierId,null,date)
        let result = calculSumTimesEtapes(etapes);
        let sum = result[0]
        let invalidData = result[1]
        let moyenne = Math.floor(sum/(etapes.length - invalidData));
        res.json({time : moyenne});
    } catch (error) {
        next(error)
    }
});

router.get("/:type/average/chantiers/:ChantierId/camionneurs/:CamionneurId", async (req, res, next) => {
    const { type , ChantierId , CamionneurId } = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,ChantierId,CamionneurId,date)
        let result = calculSumTimesEtapes(etapes);
        let sum = result[0]
        let invalidData = result[1]
        let moyenne = Math.floor(sum/(etapes.length - invalidData));
        res.json({time : moyenne});
    } catch (error) {
        next(error)
    }
});

router.get("/:type/data/chantiers/", async (req, res, next) => {
    const { type } = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,null,null,date)
        res.json({etapes : etapes});
    } catch (error) {
        next(error)
    }
});

router.get("/:type/data/chantiers/:ChantierId/", async (req, res, next) => {
    const { type, ChantierId} = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,ChantierId,null,date)
        res.json({etapes : etapes});
    } catch (error) {
        next(error)
    }
});

router.get("/:type/data/chantiers/:ChantierId/camionneurs/:CamionneurId", async (req, res, next) => {
    const { type, ChantierId , CamionneurId} = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,ChantierId,CamionneurId,date)
        res.json({etapes : etapes});
    } catch (error) {
        next(error)
    }
});

router.get("/:type/data/chantiers/best", async (req, res, next) => {
    const { type } = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,null,null,date)
        const best = getBestTime(etapes)
        res.json({best});
    } catch (error) {
        next(error)
    }
});

router.get("/:type/data/chantiers/:ChantierId/best", async (req, res, next) => {
    const { type , ChantierId } = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,ChantierId,null,date)
        const best = getBestTime(etapes)
        res.json({best});
    } catch (error) {
        next(error)
    }
});

router.get("/:type/data/chantiers/worst", async (req, res, next) => {
    const { type } = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,null,null,date)
        const worst = getWorstTime(etapes)
        res.json({worst});
    } catch (error) {
        next(error)
    }
});

router.get("/:type/data/chantiers/:ChantierId/worst", async (req, res, next) => {
    const { type , ChantierId } = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,ChantierId,null,date)
        const worst = getWorstTime(etapes)
        res.json({worst});
    } catch (error) {
        next(error)
    }
});

router.get("/chantiers/:ChantierId/nombre", async (req, res, next) => {
    const { date } = req.body;
    const { ChantierId } = req.params;
    try {
        let chargement = await Etape.findAll({ where: { type : "enChargement" ,ChantierId, [Op.not] : {dateFin : null} } })
        let dechargement = await Etape.findAll({ where: { type : "enDéchargement" ,ChantierId, [Op.not] : {dateFin : null} } })
        console.log("day : "+chargement[0].dateDebut.getDay(), "/"+chargement[0].dateDebut.getMonth()+"/"+chargement[0].dateDebut.getFullYear())
        chargement = groupByHour(chargement)
        const result = {
            chargé : chargement.length,
            déchargé : dechargement.length
        }
        res.json({result});
    } catch (error) {
        next(error)
    }
});

function groupByHour(etapes,date){
    let result = {
        6 : 0, 7 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0, 14 : 0, 15 : 0, 16 : 0, 17 : 0, 18 : 0
    }
    for (let i = 0; i < etapes.length; i++) {
        if(date.getDay() == etapes[i].getDay() && date.getMonth() == etapes[i].getMonth() && date.getFullYear() == etapes[i].getFullYear()){
            let hour = date.getHours()
            result[hour].add(result[hour]+1)
        }
    }
    return result;
}


router.get("/chantiers/nombre/", async (req, res, next) => {
    const { date } = req.body;
    try {
        console.log(date);
        let chargement = null
        let dechargement = null
        if(date == null){
            chargement = await Etape.findAll({where :  { type : "enChargement", [Op.not] : {dateFin : null} }});
            dechargement = await Etape.findAll({where :  { type : "enDéchargement",[Op.not] : {dateFin : null} }});
        }else{
            chargement = await Etape.findAll({ where: { type : "enChargement" , dateDebut: {[Op.gte]: date} , dateDebut: {[Op.lte]: date}, [Op.not] : {dateFin : null} } })
            dechargement = await Etape.findAll({ where: { type : "enDéchargement" , dateDebut: {[Op.gte]: date} , dateDebut: {[Op.lte]: date}, [Op.not] : {dateFin : null} } })
            chargement = groupByHour(chargement);
            dechargement = groupByHour(dechargement);
        }

        const result = {
            chargé : chargement,
            déchargé : dechargement
        }
        res.json(result);
    } catch (error) {
        next(error)
    }
});

    module.exports = router;
