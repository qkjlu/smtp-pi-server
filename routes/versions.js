const router = require("express").Router();
const Version = require("../models").sequelize.model("Version");
var jwt = require("jsonwebtoken");
const _ = require("lodash");

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

router.put("/", async (req, res, next) => {
  try{
    const { type, version } = req.body;
    if (!(type && version)) {
      res.sendStatus(400);
    }
    const { id } =  await Version.findOne({ where: {type: type} });
    await Version.update({version: version},{where : { id }});
    res.sendStatus(204);
  }catch(error){
    next(error);
  }
});

module.exports = router;
