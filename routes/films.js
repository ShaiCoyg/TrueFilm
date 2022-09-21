const express = require('express')
const router = express.Router()
const Film = require('../models/film')
const Director = require('../models/director')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


// All Films Route
router.get('/', async (req, res) => {
    let query = Film.find()
    if ((req.query.title) != null && req.query.title != '') {
            query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    query = query.lte('genre', req.query.genre)
    query = query.gte('genre', req.query.genre)

    try {
        const films = await query.exec()
        res.render('films/index', {
            films: films,
            searchOptions: req.query
           })
    }
    catch {
        res.redirect('/')
    }
})

//  New Film Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Film())
})

// Create Film Route
router.post('/', async (req, res) => {
    const film = new Film({
        title: req.body.title,
        director: req.body.director,
        releaseYear: req.body.releaseYear,
        genre: req.body.genre,
        length: req.body.length,
        description: req.body.description,
    })
    savePoster(film, req.body.poster)
    try {
        const newFilm = film.save()
        res.redirect('films')
    }
        catch {
            renderNewPage(res, film, true)
        }
})


async function renderNewPage (res, film, hasError=false) {
    try {
        const directors = await Director.find({})
        const params = {
            directors: directors,
            film: film
        }
        if (hasError) {
            params.errorMessage= 'Error adding a film'
        }
        res.render('films/new', params)
    }   catch {
        res.redirect('/films')
    }
}

function savePoster(film, posterEncoded) {
    if (posterEncoded == null) return
    const poster = JSON.parse(posterEncoded)
    if (poster != null && imageMimeTypes.includes(poster.type)) {
        film.posterImage = new Buffer.from(poster.data, 'base64')
        film.posterImageType = poster.type
    }
}

module.exports = router