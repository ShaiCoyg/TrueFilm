const mongoose = require('mongoose')
const Film = require('./film')
const directorsSchemass = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
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
            next(new Error('Could not delete ' + this.name + '. please make sure to first delete ' + this.title + ' films'))
        }
        else {
            next()
        }
    })
})

module.exports = mongoose.model('Director', directorsSchemass)