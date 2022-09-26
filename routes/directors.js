const express = require('express')
const { route } = require('.')
const router = express.Router()
const Director = require('../models/director')
const Film = require('../models/film')

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const directors = await Director.find(searchOptions)
        res.render('directors/index', {
            directors: directors,
            searchOptions: req.query })
    }
    catch {
        res.redirect('/')
    }
})

// New Author Route
router.get('/new', async (req, res) => {
    res.render('directors/new', { director: new Director()})
})

// Create Author Route
router.post('/', async (req, res) => {
    const director = new Director({
        name: req.body.name
    })
    try {
        const newDirector = await director.save()
        res.redirect(`/directors/` + newDirector.id)
    }
    catch {
        res.render('directors/new', {
            director: director,
            errorMessage: 'Error creating director'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const director = await Director.findById(req.params.id)
        const films = await Film.find({ director: director.id }).limit(6).exec()
        res.render('directors/show', {
            director: director,
            filmsByDirector: films
        })
    }
        catch {
            res.redirect('/')
        }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const director = await Director.findById(req.params.id)
        res.render('directors/edit', { director: director})
    }
    catch {
        res.redirect('/directors')
    }
})

router.put('/:id', async (req, res) => {
    let director
    try {
        director = await Director.findById(req.params.id)
        director.name = req.body.name
      await director.save()
      res.redirect(`/directors/` + director.id)
    } catch {
      if (director == null) {
        res.redirect('/')
      } else {
        res.render('directors/edit', {
            director: director,
          errorMessage: 'Error updating Author'
        })
      }
    }
  })

router.delete('/:id', async (req, res) => {
    let director
    try {
        director = await Director.findById(req.params.id)
        await director.remove()
        res.redirect(`/directors`)
    } catch {
      if (director == null) {
        res.redirect('/')
      } else {
        console.log(director.id)
        res.redirect('/directors/' + director.id)
      }
    }})

module.exports = router