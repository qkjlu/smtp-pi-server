const Sequelize = require("sequelize");
const sequelize = new Sequelize("smtp", "postgres", "root", {
  host: "localhost",
  dialect: "postgres",
});
const Admin = sequelize.import(__dirname + "/Admin");
const Camionneur = sequelize.import(__dirname + "/Camionneur");
const Chantier = sequelize.import(__dirname + "/Chantier");
const Etape = sequelize.import(__dirname + "/Etape");
const Grutier = sequelize.import(__dirname + "/Grutier");
const Lieu = sequelize.import(__dirname + "/Lieu");
Camionneur.hasMany(Etape);
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
// const sequelize = new Sequelize(
//   "d369c9ia7btaf5",
//   "bslixgvccooezv",
//   "db0e88b7e8f0727a3a53f3a53c5d0f4a69e68e6afdd82d5b5749d1d99bed5879",
//   {
//     host: "ec2-54-246-89-234.eu-west-1.compute.amazonaws.com",
//     port: 5432,
//     dialect: "postgres",
//     protocol: 'postgres',
//     dialectOptions: {
//       ssl: true
//   },
//   }
// );
