const router = require("express").Router();
const Admin = require("../models").sequelize.model("Admin");
var _ = require("lodash");
var jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const adminsToGet = await Admin.findAll({
    attributes : { exclude : ['password']}
  })
  res.json(adminsToGet);
});

router.post("/authenticate", async (req, res, next) => {
  try {
    const { mail, password } = req.body;
    if (!(mail && password)) {
      res.sendStatus(400);
    }
    const adminToConnect = await Admin.findOne({
      where: { mail, password },
    });
    _.isEmpty(adminToConnect)
      ? res.sendStatus(403)
      : res.json({
          token: jwt.sign(
            { id: adminToConnect.id, role: "admin" },
            process.env.JWT_SECRET
          ),
        });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
