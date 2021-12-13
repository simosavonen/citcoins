const express = require('express')
const app = express()
const morgan = require('morgan')

const coinRoutes = require('./api/routes/coins')

app.use(morgan('dev'))

app.use('/coins', coinRoutes)

app.use((req, res, next) => {
    res.status(200).json({
        message: 'Hello time traveller, buy bitcoin!'
    })
})

module.exports = app