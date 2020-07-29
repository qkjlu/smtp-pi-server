require("dotenv").config();
const Sequelize = require("sequelize");
let sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
});
const db = {
  Entreprise: sequelize.import(__dirname + "/entreprise"),
  Admin: sequelize.import(__dirname + "/admin"),
  Camionneur: sequelize.import(__dirname + "/camionneur"),
  Chantier: sequelize.import(__dirname + "/chantier"),
  Etape: sequelize.import(__dirname + "/etape"),
  Grutier: sequelize.import(__dirname + "/grutier"),
  Lieu: sequelize.import(__dirname + "/lieu"),
  Route: sequelize.import(__dirname + "/route"),
  Waypoint: sequelize.import(__dirname + "/waypoint"),
  Charte: sequelize.import(__dirname + "/charte"),
  Version: sequelize.import(__dirname + "/version"),
  Pause: sequelize.import(__dirname + "/pause"),
};

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

sequelize.sync({ alter: true });

exports.MockData = require(__dirname + "/MockData");
exports.sequelize = sequelize;
