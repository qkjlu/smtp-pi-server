const router = require('express').Router()
const Admin = require('../models').sequelize.model('Admin')

router.get('/', async (req, res) => {
    res.json(await Admin.findAll())
})

router.post('/', async (req, res) => {
    
})



module.exports = router