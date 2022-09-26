const mongoose = require('mongoose')
const Film = require('./film')
const directorsSchemass = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

directorsSchemass.pre('remove', function(next) {
    Film.find({ director: this.id }, (err, films) => {
        if (err) {
            next(err)
        }
        else if (films.length > 0) {
            next(new Error('This director has films in this website'))
        }
        else {
            next()
        }
    })
})

module.exports = mongoose.model('Director', directorsSchemass)