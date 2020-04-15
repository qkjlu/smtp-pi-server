const router = require('express').Router()
const Models = require('../models')

router.get('/', async (req, res) => {
    res.json(await Models.Admin.findAll())
})



module.exports = router