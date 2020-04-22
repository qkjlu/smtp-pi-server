const _ = require("lodash");

let helper = {};
helper.getById = async (model, req, res, next, options = {}) => {
  try {
    const { id } = req.params;
    const modelToFind = await model.findByPk(id, options);
    if (_.isEmpty(modelToFind)) {
      res.sendStatus(204);
    } else {
      res.json(modelToFind);
    }
  } catch (error) {
    next(error);
  }
};

helper.getAssociatedById = async (model, associatedModel, req, res, next) => {
  try {
    const { id } = req.params;
    const modelToFind = await model.findByPk(id, {
      include: {
        model: associatedModel,
      },
    });
    if (_.isEmpty(modelToFind)) {
      res.sendStatus(204);
    } else {
      const associateds = modelToFind.get(associatedModel.getTableName());
      if (_.isEmpty(associateds)) {
        res.sendStatus(204);
      } else {
        res.json(associateds);
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = helper;
