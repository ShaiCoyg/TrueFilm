const express = require('express')
const { route } = require('.')
const router = express.Router()
const Film = require('../models/film')
const Director = require('../models/director')
const fs = require('fs')
const path = require('path')
const multer  = require('multer')
const uploadPath = path.join('public', Film.posterImagePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All Films Route
router.get('/', async (req, res) => {
    let query = Film.find()
    if ((req.query.title) != null && req.query.title != '') {
            query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    query = query.lte('genre', req.query.genre)
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
router.post('/', upload.single('poster'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const film = new Film({
        title: req.body.title,
        director: req.body.director,
        releaseYear: req.body.releaseYear,
        genre: req.body.genre,
        length: req.body.length,
        posterImageName: fileName,
        description: req.body.description,
    })
    try {
        const newFilm = film.save()
        res.redirect('films')
    }
        catch {
            if (film.posterImageName != null) {
                removeFilmCover(film.posterImageName)
            }
            renderNewPage(res, film, true)
        }
})

function removeFilmCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if (err) {
            console.error(err)
        }
    })
}

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

module.exports = router