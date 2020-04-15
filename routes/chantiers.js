const router = require('express').Router()
const Models = require('../models')

router.get('/', async (req, res) => {
    res.json(await Models.Chantier.findAll())
})



module.exports = router