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
        .custom((id) => {
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
    res.status(204).json({
      errors: extractedErrors,
    });
  },
  updatePersonnelRules: (model) => {
    return [
      param("id")
        .isUUID()
        .withMessage("L'id doit être de type UUID")
        .bail()
        .custom((id) => {
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
        })
        .bail(),
      body("nom").exists().withMessage("Un nom doit être spécifiée").bail(),
      body("prenom")
        .exists()
        .withMessage("Un prénom doit être spécifiée")
        .bail(),
    ];
  },
  updateChantierRules: () => {
    return [
      param("id")
        .isUUID()
        .withMessage("L'id doit être de type UUID")
        .bail()
        .custom((id) => {
          return sequelize
            .model("Chantier")
            .findByPk(id)
            .then((res) => {
              if (_.isEmpty(res)) {
                return Promise.reject(
                  "L'id spécifié n'existe pas dans la base de donnée"
                );
              }
            });
        })
        .bail(),
      body("nom").exists().withMessage("Un nom doit être spécifiée").bail(),
      body("lieu")
        .exists()
        .withMessage("Un lieu doit être spécifiée")
        .bail()
        .isUUID()
        .withMessage("Un lieu doit être spécifié par son UUID")
        .bail()
        .custom((id) => {
          return sequelize
            .model("Lieu")
            .findByPk(id)
            .then((res) => {
              if (_.isEmpty(res)) {
                return Promise.reject(
                  "Le lieu spécifié n'existe pas dans la base de donnée"
                );
              }
            });
        }),
    ];
  },
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
    res.status(422).json({
      errors: extractedErrors,
    });
  },
  deleteRules: (model) => {
    return [
      body("id")
        .isUUID()
        .withMessage("L'id doit être de type UUID")
        .bail()
        .custom((id) => {
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
  removeAssociatedRules: (model, associatedModel) => {
    return [
      param("id")
        .isUUID()
        .withMessage("L'id doit être un UUID")
        .bail()
        .custom((id) => {
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
      body(associatedModel.toLowerCase())
        .exists()
        .withMessage(`N'est pas spécifié`)
        .bail()
        .isUUID()
        .withMessage(`N'est pas un UUID`)
        .bail()
        .custom((associatedId) => {
          return sequelize
            .model(associatedModel)
            .findByPk(associatedId)
            .then((res) => {
              if (_.isEmpty(res)) {
                return Promise.reject("N'existe pas dans la base de donnée");
              }
            });
        }),
    ];
  },
};

module.exports = validator;
