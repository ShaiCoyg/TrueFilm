if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const bodyParser = require('body-parser')
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

const indexRouter = require('./routes/index')
const directorRouter = require('./routes/directors')
const filmRouter = require('./routes/films')
app.use('/', indexRouter)
app.use('/directors', directorRouter)
app.use('/films', filmRouter)

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (err) => console.error(error))
db.once('open', (err) => console.log('Connected to Mongoose'))

app.listen(process.env.PORT || 3000)

