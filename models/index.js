require("dotenv").config();
const Sequelize = require("sequelize");
let sequelize;
if (process.env.NODE_ENV === "dev") {
  sequelize = new Sequelize("smtp", "postgres", "root", {
    host: "localhost",
    dialect: "postgres",
  });
}
if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
      dialect: "postgres",
      protocol: "postgres",
      logging: true
    }
  );
}

const Admin = sequelize.import(__dirname + "/Admin");
const Camionneur = sequelize.import(__dirname + "/Camionneur");
const Chantier = sequelize.import(__dirname + "/Chantier");
const Etape = sequelize.import(__dirname + "/Etape");
const Grutier = sequelize.import(__dirname + "/Grutier");
const Lieu = sequelize.import(__dirname + "/Lieu");
Camionneur.hasMany(Etape, { foreignKey: { allowNull: false } });
Camionneur.belongsToMany(Chantier, { through: "ChantierCamionneur" });
Chantier.belongsToMany(Camionneur, { through: "ChantierCamionneur" });
Etape.belongsTo(Chantier, { foreignKey: { allowNull: false } });
Lieu.belongsToMany(Grutier, { through: "LieuGrutier" });
Grutier.belongsToMany(Lieu, { through: "LieuGrutier" });
Chantier.belongsTo(Lieu, {
  as: "lieuDéchargement",
  foreignKey: { allowNull: false },
});
Chantier.belongsTo(Lieu, {
  as: "lieuChargement",
  foreignKey: { allowNull: false },
});

exports.Admin = Admin;
exports.Camionneur = Camionneur;
exports.Chantier = Chantier;
exports.Etape = Etape;
exports.Grutier = Grutier;
exports.Lieu = Lieu;
exports.MockData = require(__dirname + "/MockData");
exports.sequelize = sequelize;
