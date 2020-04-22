const { body, param, validationResult } = require("express-validator");
const sequelize = require("../../models").sequelize;
const _ = require("lodash");

const validator = {
  personnelValidationRules: () => {
    return [
      body("nom").exists().withMessage("Un nom doit être spécifié"),
      body("prenom").exists().withMessage("Un prenom doit être spécifié"),
      body("entreprise")
        .exists()
        .withMessage("Une entreprise doit être spécifiée")
        .bail()
        .isUUID()
        .withMessage("L'id de l'entreprise spécifié n'est pas de type UUID")
        .bail()
        .custom((entreprise) => {
          return sequelize
            .model("Entreprise")
            .findByPk(entreprise)
            .then((res) => {
              if (_.isEmpty(res)) {
                return Promise.reject(
                  "L'entreprise spécifié n'existe pas dans la base de donnée"
                );
              }
            });
        }),
    ];
  },
  personnelValidate: (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(400).json({
      errors: extractedErrors,
    });
  },
  getByIdRules: (model) => {
    return [
      param("id")
        .isUUID()
        .withMessage("L'id doit être de type UUID")
        .bail()
        .custom(id => {
          return sequelize
            .model(model)
            .findByPk(id)
            .then((res) => {
              if (_.isEmpty(res)) {
                return Promise.reject(
                  "L'id spécifié n'existe pas dans la base de donnée"
                );
              }
            });
        }),
    ];
  },
  getByIdValidate: (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
    console.log(extractedErrors);
    console.log(res.status(204).json({
        errors: extractedErrors,
      }));
  },
};

module.exports = validator;
