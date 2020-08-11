const router = require("express").Router();
const _ = require("lodash");
const fetch = require('node-fetch');

router.get("/v5/gh/car/:coordinates", async (req, res, next) => {
  try {
    const { coordinates } = req.params;
    const params = req.query;
  
    let url = new URL(coordinates, "https://graphhopper.com/api/1/navigate/directions/v5/gh/car/");  
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    const response = await fetch(url);
    const direction = await response.json();

    const legs = direction.routes[0].legs;
    let flattenSteps = [];
    legs.forEach(leg => {
      flattenSteps = [ ...flattenSteps, ...leg.steps ];
    })
    direction.routes[0].legs = [{steps: flattenSteps}];

    res.json(direction);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
