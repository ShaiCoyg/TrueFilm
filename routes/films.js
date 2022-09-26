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
    if ((req.query.title) != null && req.query.title != '') {
        query = query.lte('genre', req.query.genre)
    }
    if ((req.query.title) != null && req.query.title != '') {
        query = query.gte('genre', req.query.genre)
    }
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
        const newFilm = await film.save()
        res.redirect(`/films/${newFilm.id}`)
    }
        catch {
            renderNewPage(res, film, true)
        }
})

// show film route
router.get('/:id', async (req, res) => {
    try {
        const film = await Film.findById(req.params.id)
        .populate('director')
        .exec()        
        res.render('films/show', { film: film })
    }
    catch {
        res.redirect('/')
    }
})

// edit film route
router.get('/:id/edit', async (req, res) => {
    try {
        const film = await Film.findById(req.params.id)
        renderEditPage(res, film)
    }
    catch {
        res.redirect('/')
    }
})

// Update Film Route
router.put('/:id', async (req, res) => {
        let film
    try {
        film = await Film.findById(req.params.id)
        film.title = req.body.title
        film.director = req.body.director
        film.releaseYear = req.body.releaseYear
        film.length = req.body.length
        film.genre = req.body.genre
        film.description = req.body.description
        if (req.body.poster != null & req.body.poster != '') {
            savePoster(film, req.body.poster)
        }
        await film.save()
        res.redirect(`/films/${film.id}`)
        }
        catch {
            if (film != null) {
                renderEditPage(res, book, true)
            }
            else {
                redirect('/')
            }
            renderNewPage(res, film, true)
        }
})


//delete film route
router.delete('/:id', async (req, res) => {
    let film
    try {
        film = await Film.findById(req.params.id)
        await film.remove()
        res.redirect('/films')
    }
    catch {
        if (film != null) {
            res.render('films/show', {
                film: film,
                errorMessage: 'Could not remove film'
            })
        }
        else {
            res.redirect('/')
        }
    }
})

async function renderNewPage (res, film, hasError=false) {
    renderFormPage(res, film, 'new', hasError)
}

async function renderEditPage (res, film, hasError=false) {
    renderFormPage(res, film, 'edit', hasError)
}

async function renderFormPage (res, film, form, hasError=false) {
    try {
        const directors = await Director.find({})
        const params = {
            directors: directors,
            film: film
        }
        if (hasError) {
            if (form === 'edit') {
              params.errorMessage = 'Error Updating Film'
            } else {
              params.errorMessage = 'Error Creating Film'
            }
          }
        res.render(`films/${form}`, params)
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