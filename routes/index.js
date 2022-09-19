const express = require('express')
const router = express.Router()
const Film = require('../models/film')

router.get('/', async (req, res) => {
    let Films
    try {
        films = await Film.find().sort({ createdAt:'desc'}).limit(5).exec()
    }
    catch {
        films = []
    }
    res.render('index', { films: films})
})


module.exports = router