const mongoose = require('mongoose')
const adminSchemass = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Admin', adminSchemass)