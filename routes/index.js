const express = require('express')
const router = express.Router()
const Film = require('../models/film')

router.get('/', async (req, res) => {
    let films
    let filmsFeat
    try {
        films = await Film.find().sort({ createdAt:'desc'}).limit(3).exec()
        filmsFeat = await Film.find().sort({ score:'desc'}).limit(3).exec()
    }
    catch {
        films = []
    }
    res.render('index', { films: films, filmsFeat: filmsFeat})
})

router.get('/thankYou', async (req, res) => {
    res.render('../views/partials/thankYou')
})

module.exports = router