require("dotenv").config();
const Sequelize = require("sequelize");
let sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false
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
  OperationCarburant: sequelize.import(__dirname + "/operation_carburant"),
  Prelevement: sequelize.import(__dirname + "/prelevement"),
  Materiau: sequelize.import(__dirname + "/materiau"),
  JourSemaine: sequelize.import(__dirname + "/jour_semaine"),
  Coef: sequelize.import(__dirname + "/coef"),
  Sortie: sequelize.import(__dirname + "/sortie"),
  WorkTime: sequelize.import(__dirname + "/work_time")
};

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

sequelize.sync({ alter: false }).catch( e => console.error(e) );

exports.MockData = require(__dirname + "/MockData");
exports.sequelize = sequelize;
