const router = require("express").Router();
const _ = require("lodash");
const fetch = require('node-fetch');

const { createLogger } = require("winston");
const { directions } = require(".");

router.get("/v5/gh/car/:coordinates", async (req, res, next) => {
  try {
    let { coordinates } = req.params;
    const response = await fetch("https://graphhopper.com/api/1/navigate/directions/v5/gh/car/"+ coordinates +"?access_token=pk.3dcbb461-4602-4a26-85e4-d386678d019e&geometries=polyline6&overview=full&steps=true&bearings=%3B%3B%3B&continue_straight=false&annotations=congestion%2Cdistance&language=fr&roundabout_exits=true&voice_instructions=true&banner_instructions=true&voice_units=metric&enable_refresh=true");
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
