const router = require("express").Router();
const { Op } = require("sequelize");
const Etape = require("../models").sequelize.model('Etape');
const Camionneur = require("../models").sequelize.model("Camionneur");
const Chantier = require("../models").sequelize.model("Chantier");
const Pause = require("../models").sequelize.model("Pause");

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

router.get("/id", async (req, res, next) =>{
    const { id } = req.params;
    try {
        res.json(await Etape.findAll({where: { id } }));
    } catch (error) {
        next(error)
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

router.patch("/:id/debutPause", async (req, res, next) => {
  const { debutPause } = req.body;
  const { id } = req.params;
  try {
    await Etape.update({ debutPause }, { where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/finPause", async (req, res, next) => {
  const { finPause } = req.body;
  const { id } = req.params;
  try {
    await Etape.update({ finPause }, { where: { id } });
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

// get all pause for a etape where datefin is not null
async function getPause(etapeId){
  let pauses = await Pause.findAll({where : {EtapeId : etapeId, [Op.not] : {dateFin : null}}});
  return pauses
}

// sum of all pause of an etape
async function calculTimesPauseEtapes(etape){
  let pauses = await getPause(etape.id);
  let sum = 0;
  for (let i = 0; i < pauses.length; i++) {
    let time = new Date(pauses[i].dateFin).getTime() - new Date(pauses[i].dateDebut).getTime()
    let secondes = Math.floor(time / 1000);
    sum += secondes
  }
  return sum;
}


function calculSumTimesEtapes(etapes) {
    let sum = 0;
    let sum_pauses = 0;
    let invalidData = 0;
    for (let i = 0; i < etapes.length; i++) {
        let time = new Date(etapes[i].dateFin).getTime() - new Date(etapes[i].dateDebut).getTime()
        let secondes = Math.floor(time / 1000);
        if (secondes < 0) {
            console.log(" id a delete : " + etapes[i].id + " temps = " + secondes)
            invalidData++
        } else {
            console.log(secondes)
            sum_pauses += calculTimesPauseEtapes(etapes[i]);
            sum += secondes
        }
    }
    return [sum, invalidData, sum_pauses];
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

/* ---- Fin Statistics ---- */

router.get("/:type/average/chantiers/", async (req, res, next) => {
    const { type  } = req.params;
    const { date } = req.body;
    try {
        const etapes = await getEtapes(type,null,null,date)
        let result = calculSumTimesEtapes(etapes);
        let sum = result[0]
        let invalidData = result[1]
        let all_pause = result[1]
        let moyenne = Math.floor(sum/(etapes.length - invalidData));
        const data = {
            time : moyenne,
        }
        res.json(data);
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

router.get("/chantiers/:ChantierId/date/:date/nombre", async (req, res, next) => {

    const { ChantierId } = req.params;
    const dateRequest = req.params.date

    // set the beginning date to 00:00 and te end to 23:59
    const dateDebut = dateRequest + "T00:00:00.000Z";
    const dateFin = dateRequest + "T23:59:59.000Z";

    try {
        //const chargement = await Etape.findAll({where :  { type : "enChargement", ChantierId, [Op.not] : {dateFin : null} }});
        const chargement = await Etape.findAll({where :  { type : "enChargement", ChantierId, dateDebut : { [Op.gte] : new Date(dateDebut) }, dateFin:{ [Op.lt]: new Date(dateFin)} }});
        const dechargement = await Etape.findAll({where :  { type : "enDéchargement", ChantierId, dateDebut : { [Op.gte] : new Date(dateDebut) }, dateFin:{ [Op.lt]: new Date(dateFin)} }});
        const result = {
            chargé : chargement,
            déchargé : dechargement
        }
        res.json({result});
    } catch (error) {
        next(error)
    }
});

router.get("/chantiers/nombre/", async (req, res, next) => {
    try {
        const chargement = await Etape.findAll({where :  { type : "enChargement", [Op.not] : {dateFin : null} } });
        const dechargement = await Etape.findAll({where :  { type : "enDéchargement", [Op.not] : {dateFin : null} } });
        const result = {
            chargé : chargement.length,
            déchargé : dechargement.length
        }
        res.json({result});
    } catch (error) {
        next(error)
    }
});

    module.exports = router;
