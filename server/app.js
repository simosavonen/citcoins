const express = require('express')
const app = express()
const morgan = require('morgan')

const coinRoutes = require('./api/routes/coins')

app.use(morgan('dev'))

app.use('/coins', coinRoutes)

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    // handle different error types here,
    // maybe send errors to sentry.io

    next(error)
}

app.use(errorHandler)

module.exports = app