const mongoose = require('mongoose')
const path = require('path')
const posterImagePath = "uploads/filmPosters"

const filmSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    posterImageName: {
        type: String,
        required: true
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Director'
    }
})

filmSchema.virtual('posterImagePath').get(function() {
    if (this.posterImageName != null) {
        return path.join('/', posterImagePath, this.posterImageName)
    }
})
module.exports = mongoose.model('Film', filmSchema)

module.exports.posterImagePath = posterImagePath