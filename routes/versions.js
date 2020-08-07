const router = require("express").Router();
const Version = require("../models").sequelize.model("Version");
var jwt = require("jsonwebtoken");
const _ = require("lodash");

router.put("/", async (req, res, next) => {
  try{
    const { type, numero } = req.body;
    if (!(type && numero)) {
      res.sendStatus(400);
    }
    const version = await Version.findOne({ where: {type : type} });
    if(_.isNull(version)){
      await Version.create({type, numero});
    } else {
      const { id } =  version;
      await Version.update({type, numero},{where : { id }});
    }

    res.sendStatus(204);
  }catch(error){
    next(error);
  }
});

router.get("/type/:type", async (req, res, next) => {
  try{
    const { type } = req.params;
    const version = await Version.findOne({ where: {type: type} })
    if (_.isEmpty(version)) {
      res.sendStatus(204);
    } else {
      res.json(version);
    }
  }catch (error){
    next(error);
  }
});



module.exports = router;
