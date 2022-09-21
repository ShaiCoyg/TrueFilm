const mongoose = require('mongoose')

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
    posterImage: {
        type: Buffer,
        required: true
    },
    posterImageType: {
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
    if (this.posterImage != null && this.posterImageType != null) {
        return `data:${this.posterImageType};charset=utf-8;base64,${this.posterImage.toString('base64')}`
    }
})
module.exports = mongoose.model('Film', filmSchema)
