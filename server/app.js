const express = require('express')
const app = express()
const morgan = require('morgan')

const rootRoutes = require('./api/routes/root')
const coinRoutes = require('./api/routes/coins')

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    // handle different error types here,
    // maybe send errors to sentry.io

    next(error)
}

app.use(morgan('dev'))

app.use('/', rootRoutes)
app.use('/coins', coinRoutes)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app